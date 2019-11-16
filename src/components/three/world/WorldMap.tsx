import Controls from "components/three/Controls";
import Sphere from "components/three/debug/Sphere";
import DebugInspector from "components/three/DebugInspector";
import WorldMapTerrain from "components/three/world/WorldMapTerrain";
import React, { useState } from "react";
import { Canvas } from "react-three-fiber";
import { QuestStoreState } from "stores/quest";
import { Object3D, Vector3, Vector2, Camera } from "three";
import Guy from "./Guy";
import Structure from "./structures/Structure";
import Cube from "../debug/Cube";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

const terrainRotation = [-90 * (Math.PI / 180), 0, 0];
const terrainScale = [40, 40, 40];
const townPos = new Vector3(0, 0, 0);
const WIDTH = 648;
const HEIGHT = 690;
export interface Props {
  quests: QuestStoreState[];
  compassCenter: Vector2;
  onMapMove: (distance: number, angle: number) => void;
}

export interface DispatchProps {
  // onAdvanceQuest: (questName: string) => void;
}

interface LocalState {
  selectedQuest: string | null;
}

type AllProps = Props & DispatchProps;

const WorldMap = (props: AllProps) => {
    const handleClick = (object: Object3D) => {
        console.log(object);
    };

    const handleCameraMove = (camera: Camera, controls: MapControls) => {

        // the position of the compass as if it was in 3d space
        const { x, z } = unproject(camera, props.compassCenter);

        // Calculate the distance and angle between the town and the virtual compass in 3d space
        const compassPos = new Vector2(x, z);
        const distance = compassPos.distanceTo(new Vector2(townPos.x, townPos.z));
        const angle = compassPos.angle(); // This only works because our town is at 0, 0

        props.onMapMove(distance, angle);
    }

    return (
        <Canvas style = {{ height: HEIGHT, width: WIDTH }} camera={{ fov: 10 }} >
            <DebugInspector /> */}
            <Controls onCameraMove={handleCameraMove} />
            <WorldMapTerrain rotation={terrainRotation} scale={terrainScale} />
            <Sphere onClick={handleClick} position={[62, 0, 14]} name="party1" />
            {/* <Sphere onClick={handleClick} name="party2" /> */}
            <Cube size={[1,1,1]} position={[0,0,0]} color="red"/>
            <Cube size={[1,1,1]} position={[0,0,1]} color="blue"/>
            <Guy url="models/westernkingdoms/models/WK_archer.FBX" position={[220, 20, 110]} />

            <Structure url="models/world/human/house_atlas.fbx" position={[10, 0, 0]}/>
            <Structure url="models/world/human/smithy_atlas.fbx" position={[20, 0, 10]}/>
        </Canvas>
    );
};

interface ModelProps {
  url: string;
}

export default WorldMap;

// returns a point on the ground under the 
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
}