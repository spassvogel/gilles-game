// It's a js file because there is some problem with the 
import React, { useMemo, useContext, useState, useRef, useEffect } from 'react'
import useModel from "hooks/useModel";
import * as THREE from 'three'
import { useLoader } from "react-three-fiber";

const textureUrl = "models/world/human/Textures/RTS_human_atlas_4096.png";


export interface Props {
    url: string;
    position?: THREE.Vector3|number[];
}

const Structure = (props: Props) => {

    const geometry = useModel(props.url);

    const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl]);
    //const textureUrl = "models/terrain/grass1.png";
    //const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl])
    if (!geometry || !texture) {
        return null;
    }

    console.log(texture)
    return (
        <mesh
            name={`Model (${props.url})`}
            geometry={geometry}
            position={props.position}
            scale={[.1, .1, .1]}
        >
            <meshBasicMaterial
                attach="material"
                fog={true}
                map={texture}
            >
        </meshBasicMaterial>
        </mesh>
    );
  }

export default Structure;
