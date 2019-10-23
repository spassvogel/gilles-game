// It's a js file because there is some problem with the
import Model from 'Model';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useThree } from 'react-three-fiber'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { useRender } from 'react-three-fiber'
import * as THREE from 'three'

function Controls(props/*: ModelProps | any*/) {
    const { camera } = useThree();
    const controls = useRef();
    const camToSave = useRef({});
    //const [ controls, setControls ] = useState(null);

    useEffect(() => {
      const mapControls = new MapControls( camera );
    // controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
      mapControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      mapControls.dampingFactor = 0.05;
      mapControls.screenSpacePanning = true;
      mapControls.minDistance = 100;
      mapControls.maxDistance = 500;
      mapControls.maxPolarAngle = Math.PI / 2;
      mapControls.target = new THREE.Vector3(0, 0, 0);
      //mapControls.enableRotate = false;
     // mapControls.enableZoom = false;
      //setControls(mapControls);
      controls.current = mapControls;

      camera.position.set(0, 0, 20);
      camToSave.current.position = camera.position.clone();
      camToSave.current.rotation = camera.rotation.clone();
      camToSave.current.controlCenter = mapControls.target.clone();

      /*setTimeout(() => {
        //controls.current.reset();
        //camera.position.set(34.83934810382639, 371.7422948770782, 162.6314663448899);
        const { position, rotation, controlCenter } = camToSave.current;
        restoreCamera(position, rotation, controlCenter);
      }, 5000);*/
    }, []);

    function restoreCamera(position, rotation, controlCenter){
      camera.position.set(position.x, position.y, position.z);
      camera.rotation.set(rotation.x, rotation.y, rotation.z);
  
      controls.current.target.set(controlCenter.x, controlCenter.y, controlCenter.z);
    }

    useRender(state => {
      if (controls.current) {
        controls.current.update();
      }
     //console.log(state.camera.rotation)
    })

    return null;
}

export default Controls;
