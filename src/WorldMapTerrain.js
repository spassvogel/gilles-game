// It's a js file because there is some problem with the 
import React, { useMemo, useContext, useState, useRef, useEffect } from 'react'
import Model from 'Model';
import { useThree, useResource } from 'react-three-fiber'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import useModel from "hooks/useModel";
import * as THREE from 'three'

function WorldMapTerrain(props/*: ModelProps | any*/) {
    const { scene, camera } = useThree();

    if(!window.scene) window.scene = scene;
    
//     useEffect(() => {
//     const controls = new MapControls( camera );
//   //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
// //  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
//   //controls.dampingFactor = 0.05;
//   controls.screenSpacePanning = true;
//   controls.minDistance = 100;
//   controls.maxDistance = 500;
//   controls.maxPolarAngle = Math.PI / 2;
//     console.log(controls)
//     }, []);
    const url = "models/terrain/terrain-grass.dae";
    const geometry = useModel(url);
    const textureUrl = "models/terrain/grass1.png";
    const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl])

    if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }

    return geometry && texture ? <mesh 
      name = { `Model (${url})` }
      geometry={ geometry }
      scale = { new THREE.Vector3(30, 30, 30)}
    >
        <meshBasicMaterial
            attach="material"
            roughness={0.8}
            metalness={0.6}
            // color="#1c1c1c"
            fog={true}
        >
            <primitive attach="map" object={texture} />
        </meshBasicMaterial>
    </mesh> : null;
  }

export default WorldMapTerrain;