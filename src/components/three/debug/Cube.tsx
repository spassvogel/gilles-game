import React, {  } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

export interface Props {
  name?: string;
  color?: string;
  size?: THREE.Vector3|number[];
  position?: THREE.Vector3|number[];
  onClick?: (object: THREE.Object3D) => void;
}

const Cube = (props: Props) => {
    const size = parseVector3(props.size || new THREE.Vector3(1, 1, 1));
    const geometry = new THREE.BoxGeometry( size.x, size.y, size.z );
    const material = new THREE.MeshBasicMaterial( {color: (props.color || "green")} );

    const handleClick = (evt: any) => {
      if (props.onClick) {
        props.onClick(evt.object);
      }
    };

    if (!geometry) {
      return null;
    }
    return (
      <mesh
        name={props.name}
        position={props.position}
        onClick={handleClick }
        geometry={geometry }
        material={material }
      />
    );
  };

export default Cube;

const parseVector3 = (input: THREE.Vector3|number[]): THREE.Vector3 => {
    if (input instanceof THREE.Vector3) {
        return input;
    }
    const [x, y, z] = input;
    return new Vector3(x, y, z);
}