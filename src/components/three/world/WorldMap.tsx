import WorldMapTerrain from "components/three/world/WorldMapTerrain";
import Controls from "Controls";
import DebugInspector from "DebugInspector";
import { useMedia } from 'hooks/useMedia';
import React, { useMemo, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import Sphere from "Sphere";
import { QuestStoreState } from "stores/quest";
import { Object3D, Vector3 } from "three";
import * as THREE from 'three'
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
      <DebugInspector />
      <Controls />
     {/* <Model url="models/town/house2/Medieval_House.obj"  position = { [ 1, 1, 1]} />
     <Model url="models/town/house2/Medieval_House.obj"  position = { [ 258.861, 0, -55.582]} />
     <Terrain heightmap = { heightmap } position = { [ 258.861, 0, -55.582]} name = "Terrain" /> */}
     <WorldMapTerrain rotation={terrainRotation} scale={terrainScale} />
     <Sphere onClick={handleClick} position={[62, 0, 14]} name="party1" />
     <Sphere onClick={handleClick} name="party2" />
     <Structure url="models/world/human/house_atlas.fbx" position={[10, 0, 0]}/>
     <Structure url="models/world/human/smithy_atlas.fbx" position={[20, 0, 10]}/>
     </Canvas>
  );
};

interface ModelProps {
  url: string;
}

export default WorldMap;

