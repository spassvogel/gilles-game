// It's a js file because there is some problem with the 
import * as THREE from 'three'
import React, { useMemo, useState } from 'react'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'

function Model(props/*: ModelProps | any*/) {
    const { url } = props;
    const [geometry, setGeometry] = useState();

    useMemo(() => {
      if (url.toLowerCase().endsWith('obj')){
        new OBJLoader().load(url, (grp/*: Group*/) => {
          setGeometry((grp.children[0]/* as Mesh*/).geometry);
        });  
      }
      else if (url.toLowerCase().endsWith('dae')){
        new ColladaLoader().load(url, (collada) => {
          setGeometry(collada.scene.children[0].geometry);
          console.log(collada.scene.children[0].geometry)
        }); 
      }
    }, [url]);

    //return <primitive object={cube} position={[0, 0, 0]}></primitive>;
    return geometry ? <mesh 
      name = { `Model (${url})` }
      geometry={ geometry } {...props}
    >
      {/* <primitive object={cube} position={[0, 0, 0]}></primitive> */}
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

export default Model;