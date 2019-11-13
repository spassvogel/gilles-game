// It's a js file because there is some problem with the
import useModel from "hooks/useModel";
import React, { useMemo } from "react";
import * as THREE from "three";
import { Mesh } from "three";

export interface Props {
    rotation?: THREE.Euler|number[];
    scale?: THREE.Vector3|number[];
}
const WorldMapTerrain = (props: Props) => {

    const url = "models/terrain/terrain-grass.dae";
    const textureUrl = "models/terrain/grass1.png";
    const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl]);

    const modelInfo = useModel(url);
    const geometry = useMemo(() => {
        if (modelInfo) {
            return (modelInfo.children[0].children[0] as Mesh).geometry;
        }
        return null;
    }, [modelInfo]);

    if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }

    if (!geometry || !texture) {
        return null;
    }

    return (
        <mesh
            name={`Model (${url})`}
            scale={props.scale || [1, 1, 1]}
            rotation={props.rotation}
        >
            <meshBasicMaterial
                attach="material"
                fog={true}
            >
            <primitive attach="map" object={texture} />
            </meshBasicMaterial>
            <bufferGeometry attach="geometry" {...geometry} />
        </mesh>
    );
  };

export default WorldMapTerrain;
