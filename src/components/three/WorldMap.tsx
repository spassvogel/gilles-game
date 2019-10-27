import * as THREE from 'three'
import React, { useMemo, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { useMedia } from 'hooks/useMedia';
import WorldMapTerrain from "WorldMapTerrain";
import Sphere from "Sphere";
import Controls from "Controls";
import DebugInspector from "DebugInspector";
import { Object3D, Vector3 } from "three";

interface Props {
}

function WorldMap(props: Props) {
  console.log('render')

  const handleClick = (object: Object3D) => {
    console.log(object)
  };

  return (
    <Canvas style = {{ height: 860, width: 648 }} >
      <DebugInspector />
      <Controls />
     {/* <Model url="models/town/house2/Medieval_House.obj"  position = { [ 1, 1, 1]} />
     <Model url="models/town/house2/Medieval_House.obj"  position = { [ 258.861, 0, -55.582]} />
     <Terrain heightmap = { heightmap } position = { [ 258.861, 0, -55.582]} name = "Terrain" /> */}
     <WorldMapTerrain name="terrain"/>
     <Sphere onClick={handleClick} position={[62, 0, 14]} name="party1" />
     <Sphere onClick={handleClick} name="party2" />
     </Canvas>
  )
}

interface ModelProps {
  url: string;
}

export default WorldMap;

