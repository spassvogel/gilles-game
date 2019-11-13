import Controls from "components/three/Controls";
import DebugInspector from "components/three/DebugInspector";
import WorldMapTerrain from "components/three/world/WorldMapTerrain";
import React from "react";
import { Canvas } from "react-three-fiber";
import Sphere from "Sphere";
import { QuestStoreState } from "stores/quest";
import { Object3D, Vector3 } from "three";
import Guy from "./Guy";
import Structure from "./structures/Structure";

const terrainRotation = [-90 * (Math.PI / 180), 0, 0];
const terrainScale = [40, 40, 40];

export interface Props {
  quests: QuestStoreState[];
}

export interface DispatchProps {
  // onAdvanceQuest: (questName: string) => void;
}

interface LocalState {
  selectedQuest: string | null;
}

type AllProps = Props & DispatchProps;

const WorldMap = (props: AllProps) => {
    console.log("render");

    const handleClick = (object: Object3D) => {
        console.log(object);
    };

    return (

        <Canvas style = {{ height: 860, width: 648 }} >
            <DebugInspector /> */}
            <Controls />
            <WorldMapTerrain rotation={terrainRotation} scale={terrainScale} />
            <Sphere onClick={handleClick} position={[62, 0, 14]} name="party1" />
            <Sphere onClick={handleClick} name="party2" />
            <Guy url="models/westernkingdoms/models/WK_archer.FBX" position={[220, 20, 110]} />

             <Structure url="models/world/human/house_atlas.fbx" position={[10, 0, 0]}/>
            <Structure url="models/world/human/smithy_atlas.fbx" position={[120, 0, 110]}/>
        </Canvas>
    );
};

interface ModelProps {
  url: string;
}

export default WorldMap;

