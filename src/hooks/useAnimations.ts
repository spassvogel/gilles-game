import React, { useEffect, useState } from "react";
import { Geometry, Group, Mesh, AnimationClip } from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const useAnimations = (url: string) => {
    const [animations, setAnimations] = useState<AnimationClip[] | null>();

    useEffect(() => {
        const onError = (e: ErrorEvent) => {
            // tslint:disable-next-line: no-console
            console.error(`Error loading file ${url}`, e);
        };

        if (url.toLowerCase().endsWith("fbx")) {
            new FBXLoader().load(url, (object: any) => {
                setAnimations(object.animations);
            }, undefined, onError);
        } else {
            // tslint:disable-next-line: no-console
            console.error(`Unknown format for model file ${url}`);
        }
    }, [url]);
    return animations;
//   const geom = useMemo(() => {
//     const temp = []
//     scene.traverse(child => child.isMesh && temp.push(child.geometry))
//     return temp
//   }, [scene])
//   return [geom, scene.children[0].position]
};

export default useAnimations;
