// It's a js file because there is some problem with the 
import React, { useMemo, useContext, useState, useRef, useEffect } from 'react'
import useModel from "hooks/useModel";
import * as THREE from 'three'

export interface Props {
    rotation?: THREE.Euler|number[];
    scale?: THREE.Vector3|number[];
}
const WorldMapTerrain = (props: Props) => {

    //if(!window.scene) window.scene = scene;
    
    const url = "models/terrain/terrain-grass.dae";
    const geometry = useModel(url);
    const textureUrl = "models/terrain/grass1.png";
    const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl])

    if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }

    if (!geometry || !texture) {
        return null;
    }

console.log(props.scale || [1, 1, 1])
    return (
        <mesh
            name={`Model (${url})`}
            geometry={geometry}
            scale={props.scale || [1, 1, 1]}
            rotation={props.rotation}
        >
            <meshBasicMaterial
                attach="material"
                fog={true}
            >
            <primitive attach="map" object={texture} />
        </meshBasicMaterial>
        </mesh>
    );
  }

export default WorldMapTerrain;