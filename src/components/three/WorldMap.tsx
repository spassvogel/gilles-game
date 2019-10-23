import * as THREE from 'three'
import React, { useMemo, useState } from 'react'
import { Canvas } from 'react-three-fiber'
import { useMedia } from 'hooks/useMedia';
import WorldMapTerrain from "WorldMapTerrain";
import Sphere from "Sphere";
import Controls from "Controls";
import DebugInspector from "DebugInspector";

interface Props {
}

function WorldMap(props: Props) {
  console.log('render')
  return (
    <Canvas style = {{ height: 860, width: 648 }} >
      <DebugInspector />
      <Controls />
     {/* <Model url="models/town/house2/Medieval_House.obj"  position = { [ 1, 1, 1]} />
     <Model url="models/town/house2/Medieval_House.obj"  position = { [ 258.861, 0, -55.582]} />
     <Terrain heightmap = { heightmap } position = { [ 258.861, 0, -55.582]} name = "Terrain" /> */}
     <WorldMapTerrain name="terrain"/>
     <Sphere />
     </Canvas>
  )
}

interface ModelProps {
  url: string;
}

export default WorldMap;

