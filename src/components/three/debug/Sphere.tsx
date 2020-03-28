import React, {  } from "react";
import * as THREE from "three";
import { Vector3 } from 'three';

export interface Props {
  name?: string;
  position?: THREE.Vector3|number[];
  onClick?: (object: THREE.Object3D) => void;
}

const Sphere = (props: Props) => {
    const geometry = new THREE.SphereGeometry( 5, 32, 32 );
    const material = new THREE.MeshBasicMaterial( {color: "purple"} );

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
        name={ props.name}
        position={parseVector3(props.position || new Vector3()  )}
        onClick={ handleClick }
        geometry={ geometry }
        material={ material }
      />
    );
  };

export default Sphere;

const parseVector3 = (input: THREE.Vector3|number[]): THREE.Vector3 => {
  if (input instanceof THREE.Vector3) {
      return input;
  }
  const [x, y, z] = input;
  return new Vector3(x, y, z);
};

