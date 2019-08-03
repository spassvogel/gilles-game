import * as THREE from 'three'
import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import { Canvas } from 'react-three-fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { Group, Mesh } from "three";
import { ReactThreeFiber } from "react-three-fiber/types/three";

interface Props {
}

function Thing(props: Props) {
  return (
    <Canvas style = {{ height: 800, width: 600 }} camera = {{
      position: [61.534, 161.089, 658.156]
    }}>
     <Model url="models/town/house2/Medieval_House.obj"  position = { [ 1, 1, 1]} />
     <Model url="models/town/house2/Medieval_House.obj"  position = { [ 258.861, 0, -55.582]} />
     </Canvas>
  )
}

interface ModelProps {
  url: string;
}
function Model(props: ModelProps | any) {
    const { url } = props;
    const [geometry, setGeometry] = useState();

    useMemo(() => {
      console.log("loading")
      new OBJLoader().load(url, (grp: Group) => {
        setGeometry((grp.children[0] as Mesh).geometry);
      });
    }, [url]);

    const cube = new THREE.Mesh( new THREE.CircleBufferGeometry( 200, 200, 200 ), new THREE.MeshNormalMaterial() );
    cube.position.y = 150;

    return geometry ? <mesh 
      //onClick
      geometry={ geometry } {...props}
    >
      <primitive object={cube} position={[0, 0, 0]}></primitive>
    <meshPhysicalMaterial
      attach="material"
      roughness={0.8}
      metalness={0.6}
      //emissive="#a4f20d"
      //emissiveIntensity={active ? 0.1 : 0}
      color="#1c1c1c"
      fog={true}
      //shininess={0.5}
    />
  </mesh> : null;
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