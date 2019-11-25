import React, {  } from "react";
import * as THREE from "three";

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
        position={props.position}
        onClick={ handleClick }
        geometry={ geometry }
        material={ material }
      />
    );
  };

export default Sphere;
