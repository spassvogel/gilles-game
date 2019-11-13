// It's a js file because there is some problem with the 
import React, { useMemo, useContext, useState, useRef, useEffect } from 'react'
import useModel from "hooks/useModel";
import * as THREE from 'three'
import { useLoader, useFrame } from "react-three-fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import useAnimations from "hooks/useAnimations";
import { Group, Mesh } from "three";

const textureUrl = "models/world/human/Textures/RTS_human_atlas_4096.png";
const animationUrl = "models/westernkingdoms/animation/archer/WK_archer_02_walk.FBX";

export interface Props {
    url: string;
    position?: THREE.Vector3|number[];
}

const speed = 1;
const Guy = (props: Props) => {

    const modelInfo = useModel(props.url);
    const animations = useAnimations(animationUrl);
    const group = useRef()

    const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl]);
    
    const [mixer] = useState(() => new THREE.AnimationMixer(null))


    const geometry = useMemo(() => {
        if (modelInfo) {
            return (modelInfo.children[0] as Mesh).geometry;
        }
        return null;
    }, [modelInfo]);

    const bones = useMemo(() => {
        if (modelInfo) {
            return (modelInfo.children[1] as Mesh).geometry;
        }
        return null;
    }, [modelInfo]);

    useEffect(() => {
        if(animations && bones) {
            console.log(animations)
            mixer.clipAction(animations[0], bones).play();
        }
    } , [animations, bones]);

    useFrame((state, delta) => {
      //group.current.rotation.y += Math.sin((delta * factor) / 2) * Math.cos((delta * factor) / 2) * 1.5
      mixer.update(delta * speed);
    })

    //const textureUrl = "models/terrain/grass1.png";
    //const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl])
    if (!geometry || !texture) {
        return null;
    }

    return (
        <group ref={group}>
        <mesh
            name={`Model (${props.url})`}
            position={props.position}
            scale={[1, 1, 1]}
        >
            <meshBasicMaterial
                attach="material"
                fog={true}
                color={"purple"}
                map={texture}
            />
            <bufferGeometry attach="geometry" {...geometry} />
        </mesh>
        </group>
    );
  }
//https://codesandbox.io/embed/react-three-fiber-gltf-loader-animations-c671i
export default Guy;
