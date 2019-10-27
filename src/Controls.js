// It's a js file because there is some problem with the typings
import Model from 'Model';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useThree } from 'react-three-fiber'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { useRender } from 'react-three-fiber'
import * as THREE from 'three'

const LOCAL_STORAGE_KEY = 'worldpos';
const DEFAULT_START_POS = new THREE.Vector3(0, 0, 20);

const Controls = (props/*: ModelProps | any*/) => {
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

      camera.position.copy(DEFAULT_START_POS);
      const savedCamera = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

      if(savedCamera){
        camera.position.copy( savedCamera.cam );
        mapControls.target.copy( savedCamera.target );
      }
    }, []);

    useRender(state => {
      if (controls.current) {
        controls.current.update();
      }
    })

    useEffect(() => {
      const savePosition = () => {
        // todo: save in redux or just here?        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          cam: camera.position,
          target: controls.current.target
        }));
      }
      const interval = setInterval(savePosition, 150);
      return () => {
        clearInterval(interval);
      };
    }, [])

    return null;
}

export default Controls;
