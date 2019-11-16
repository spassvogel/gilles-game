import React, { useEffect, useState } from "react";
import { Geometry, Group, Mesh } from "three";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

const useModel = (url: string) => {
    //const [geometry, setGeometry] = useState<Geometry | null>();
    const [group, setGroup] = useState<Group | null>();

    useEffect(() => {
        const onError = (e: ErrorEvent) => {
            // tslint:disable-next-line: no-console
            console.error(`Error loading model ${url}`, e);
        };

        if (url.toLowerCase().endsWith("obj")) {
            new OBJLoader().load(url, (grp: Group) => {
                //setGeometry((grp.children[0] as Mesh).geometry as Geometry);
            });
        } else if (url.toLowerCase().endsWith("dae")) {
            new ColladaLoader().load(url, (collada) => {
                const colladaGroup = new Group();
                colladaGroup.children.push(collada.scene);
                setGroup(colladaGroup);

                //setGeometry((collada.scene.children[0] as Mesh).geometry as Geometry);
                // console.log(collada.scene.children[0].geometry)
            });
        } else if (url.toLowerCase().endsWith("fbx")) {
            new FBXLoader().load(url, (object: Group) => {
                //setGeometry((object.children[0] as Mesh).geometry as Geometry);
                setGroup(object);
            }, undefined, onError);
        } else {
            // tslint:disable-next-line: no-console
            console.error(`Unknown format for model ${url}`);
        }
    }, [url]);
    return group;
//   const geom = useMemo(() => {
//     const temp = []
//     scene.traverse(child => child.isMesh && temp.push(child.geometry))
//     return temp
//   }, [scene])
//   return [geom, scene.children[0].position]
};

export default useModel;
