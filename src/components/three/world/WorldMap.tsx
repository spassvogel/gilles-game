import Controls from "components/three/Controls";
import Sphere from "components/three/debug/Sphere";
import DebugInspector from "components/three/DebugInspector";
import WorldMapTerrain from "components/three/world/WorldMapTerrain";
import { getDefinition } from "definitions/quests";
import React from "react";
import { Canvas } from "react-three-fiber";
import { QuestStoreState } from "stores/quest";
import { Camera, Object3D, Vector2, Vector3 } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";
import Cube from "../debug/Cube";
import Guy from "./Guy";
import Structure from "./structures/Structure";

const terrainRotation = [-90 * (Math.PI / 180), 0, 0];
const terrainScale = [40, 40, 40];
const townPos = new Vector3(0, 0, 0);
const WIDTH = 648;
const HEIGHT = 690;
export interface Props {
  quests: QuestStoreState[];
  compassCenter: Vector2; // compass center in 2d UI coordinate system
  scrollToPosition?: Vector2;
  activeQuests: QuestStoreState[];
  selectedQuest?: string;
  onMapMove: (distance: number, angle: number) => void;
  onPartyClick: (questName: string) => void;
}

// tslint:disable-next-line: no-empty-interface
export interface DispatchProps {
  // onAdvanceQuest: (questName: string) => void;
}

type AllProps = Props & DispatchProps;

const WorldMap = (props: AllProps) => {
    // useEffect(() => {
    // }, [props.scrollToPosition]);

    const handleClick = (object: Object3D) => {
        // console.log(object);
    };

    const handleCameraMove = (camera: Camera) => {

        // the position of the compass as if it was in 3d space
        const { x, z } = unproject(camera, props.compassCenter);

        // Calculate the distance and angle between the town and the virtual compass in 3d space
        const compassPos = new Vector2(x, z);
        const distance = compassPos.distanceTo(new Vector2(townPos.x, townPos.z));
        const angle = compassPos.angle(); // This only works because our town is at 0, 0

        props.onMapMove(distance, angle);
    };

    const handlePartyClick = (name: string) => {
        props.onPartyClick(name);
    };

    const renderParties = () => {
        return props.activeQuests.map(quest => {
            const questPosition = getQuestWorldPosition(quest);
            return (
                <Cube
                    size={[1, 1, 1]}
                    position={questPosition}
                    color={ quest.name === props.selectedQuest ? "white" : "red"}
                    onClick={() => handlePartyClick(quest.name)}
                />
            );
        });
    }

    return (
        <Canvas style = {{ height: HEIGHT, width: WIDTH }} camera={{ fov: 10 }} >
            <DebugInspector /> */}
            <Controls onCameraMove={handleCameraMove} scrollToPosition={props.scrollToPosition} />
            <WorldMapTerrain rotation={terrainRotation} scale={terrainScale} />
            <Sphere onClick={handleClick} position={[62, 0, 14]} name="party1" />
            {/* <Sphere onClick={handleClick} name="party2" /> */}
            { renderParties() }
            <Cube size={[1, 1, 1]} position={[0, 0, 1]} color="blue"/>
            <Cube size={[1, 1, 1]} position={[1, 0, 2]} color="blue"/>
            {/* <Guy url="models/westernkingdoms/models/WK_archer.FBX" position={[220, 20, 110]} /> */}

            <Structure url="models/world/human/house_atlas.fbx" position={[10, 0, 0]}/>
            <Structure url="models/world/human/smithy_atlas.fbx" position={[20, 0, 10]}/>
        </Canvas>
    );
};

export default WorldMap;

// returns a point on the ground under the camera
const unproject = (camera: Camera, screenLocation: Vector2, groundY: number = 0): Vector3 => {
    const vector = new Vector3();
    vector.set(
      (screenLocation.x / WIDTH) * 2 - 1,
      -(screenLocation.y / HEIGHT) * 2 + 1,
      0.5,
    );
    vector.unproject( camera );

    const direction = vector.sub(camera.position).normalize();
    const distance = (groundY - camera.position.y) / direction.y;
    return camera.position.clone().add(direction.multiplyScalar(distance));
};

// Gets 3d world position of quest
const getQuestWorldPosition = (quest: QuestStoreState): Vector3 => {
    const questDefinition = getDefinition(quest.name);
    const roundedProgress = Math.floor(quest.progress);
    const lastPosition = questDefinition.nodes[roundedProgress];
    const lastPositionWorld = new Vector3(lastPosition.x, 1, lastPosition.y);

    const nextPosition = questDefinition.nodes[roundedProgress + 1];
    if (!nextPosition) {
        // We've reached the last node
        return lastPositionWorld;
    }
    const nextPostionWorld = new Vector3(nextPosition.x, 1, nextPosition.y);
    return lastPositionWorld.lerp(nextPostionWorld, quest.progress - roundedProgress);
};