// It's a js file because there is some problem with the typings
import React, { useEffect, useRef } from 'react'
import { useThree } from 'react-three-fiber'
import { MapControls } from 'three/examples/jsm/controls/OrbitControls'
import { useRender } from 'react-three-fiber'
import * as THREE from 'three'

const LOCAL_STORAGE_KEY = 'worldpos';
const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 260, 0);

const Controls = (props/*: ModelProps | any*/) => {
    const { camera } = useThree();
    const controls = useRef();

    useEffect(() => {
      const mapControls = new MapControls( camera );
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

      camera.position.copy(DEFAULT_CAMERA_POS);
      const savedCamera = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

      if(savedCamera){
        camera.position.copy( savedCamera.cam );
        mapControls.target.copy( savedCamera.target );
      }
    }, [camera]);

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
    }, [camera.position])

    return null;
}

export default Controls;
