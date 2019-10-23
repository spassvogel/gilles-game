// It's a js file because there is some problem with the 
import React, { useMemo, useContext, useState, useRef, useEffect } from 'react'
import Model from 'Model';
import { useThree, useResource } from 'react-three-fiber'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import useModel from "hooks/useModel";
import * as THREE from 'three'

function Sphere(props/*: ModelProps | any*/) {
    const { scene, camera } = useThree();

    if(!window.scene) window.scene = scene;
    
    var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );


    return geometry ? <mesh 
      name = { `sphere` }
      geometry = { geometry }
      material = { material }
      scale = { new THREE.Vector3(30, 30, 30)}
    >
    </mesh> : null;
  }

export default Sphere;