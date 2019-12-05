import useModel from "hooks/useModel";
import React, { useMemo } from "react";
import * as THREE from "three";
import { Mesh } from "three";

const textureUrl = "models/world/human/Textures/RTS_human_atlas_4096.png";

export interface Props {
    url: string;
    position?: THREE.Vector3|number[];
}

const Structure = (props: Props) => {

   // const loader = useLoader(FBXLoader, props.url);

    const modelInfo = useModel(props.url);
    const geometry = useMemo(() => {
        if (modelInfo) {
            return (modelInfo.children[0] as Mesh).geometry;
        }
        return null;
    }, [modelInfo]);

    const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl]);
    // const textureUrl = "models/terrain/grass1.png";
    // const texture = useMemo(() => new THREE.TextureLoader().load(textureUrl), [textureUrl])
    if (!geometry || !texture) {
        return null;
    }

    return (
        <mesh
            name={`Model (${props.url})`}
            position={props.position}
            scale={[.01, .01, .01]}
        >
            <meshBasicMaterial
                attach="material"
                fog={true}
                map={texture}
            />
            <bufferGeometry attach="geometry" {...geometry} />

        </mesh>
    );
};

export default Structure;