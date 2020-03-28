import useAnimations from "hooks/useAnimations";
import useModel from "hooks/useModel";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import { Mesh, Vector3 } from "three";

const textureUrl = "models/westernkingdoms/models/textures/WK_StandardUnits_Blue.png";
const animationUrl = "models/westernkingdoms/animation/worker/WK_worker_carry_wood_01_idle.FBX";

export interface Props {
    url: string;
    position?: THREE.Vector3|number[];
}

const speed = 1;
const Guy = (props: Props) => {

    const modelInfo = useModel(props.url);
    const animations = useAnimations(animationUrl);
    const group = useRef();

    const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl]);
    const [mixer] = useState(() => new THREE.AnimationMixer(null));

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
        // console.log('a', animations)
        // console.log('b', group)
        if (animations) {
            // console.log(animations)
            mixer.clipAction(animations[0], group.current).play();
        }
    } , [animations, bones]);

    useFrame((state, delta) => {
      mixer.update(delta * speed);
    });

    // const textureUrl = "models/terrain/grass1.png";
    // const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl])
    if (!geometry || !texture) {
        return null;
    }

    return (
        <group ref={group}>
        <mesh
            name={`Model (${props.url})`}
            position={parseVector3(props.position || new Vector3()  )}
            scale={[1, 1, 1]}
        >
            <meshBasicMaterial
                attach="material"
                fog={true}
                //color={"purple"}
                map={texture}
            />
            <bufferGeometry attach="geometry" {...geometry} />
        </mesh>
        </group>
    );
};

export default Guy;
// https://codesandbox.io/embed/react-three-fiber-gltf-loader-animations-c671i


const parseVector3 = (input: THREE.Vector3|number[]): THREE.Vector3 => {
    if (input instanceof THREE.Vector3) {
        return input;
    }
    const [x, y, z] = input;
    return new Vector3(x, y, z);
  };