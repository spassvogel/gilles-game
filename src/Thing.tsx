import * as THREE from 'three'
import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Group, Mesh, Vector3 } from "three";
import Model from 'Model';

interface Props {
}

function Thing(props: Props) {
  return (
    <Canvas style = {{ height: 800, width: 600 }} 
    camera = {{
      position: new Vector3(61.534, 161.089, 658.156),
    }}>
     <Model url="models/town/house2/Medieval_House.obj"  position = { [ 1, 1, 1]} />
     <Model url="models/town/house2/Medieval_House.obj"  position = { [ 258.861, 0, -55.582]} />
     </Canvas>
  )
}

interface ModelProps {
  url: string;
}

export default Thing;


const loadObj = (url: string) => {
  return new Promise<Group>((resolve, reject) => {
    //new FBXLoader().load(url, resolve, undefined, reject);
    new OBJLoader().load(url, resolve, undefined, reject);
  });
};

/*loadObj(`models/town/house2/Medieval_House.obj`).then((grp: Group) => {
  console.log(grp);
  console.log(grp.children[0])
  console.log((grp.children[0] as Mesh).geometry);

  // const geometries = {}
  // gltf.scene.traverse(child => child.isMesh && (geometries[child.name] = child.geometry.clone()))
  // return geometries
});*/

// export default Promise.all([extract("stones")]).then(geometries => {
//   return {
//     headstones: geometries[0],
//     mausoleum: geometries[1],
//     gate: geometries[2],
//     tomb: geometries[3]
//   }
// })

export const headstoneNames = [
  "BigCross",
  "Basic",
  "BasicNarrow",
  "BasicNarrowTall",
  "BasicNarrowCross",
  "BasicPointy",
  "SpireSimple"
]