import React, { useState, useEffect } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader"
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader"
import { Mesh, Group, Geometry } from "three";

const useModel = (url: string) => {
    const [geometry, setGeometry] = useState<Geometry | null>();

    useEffect(() => {
        if (url.toLowerCase().endsWith("obj")) {
            new OBJLoader().load(url, (grp: Group) => {
                setGeometry((grp.children[0] as Mesh).geometry as Geometry);
            });
        } else if (url.toLowerCase().endsWith("dae")){
            new ColladaLoader().load(url, (collada) => {
                setGeometry((collada.scene.children[0] as Mesh).geometry as Geometry);
                //console.log(collada.scene.children[0].geometry)
            });
        }
    }, [url]);
    return geometry;
//   const geom = useMemo(() => {
//     const temp = []
//     scene.traverse(child => child.isMesh && temp.push(child.geometry))
//     return temp
//   }, [scene])
//   return [geom, scene.children[0].position]
}

export default useModel;
