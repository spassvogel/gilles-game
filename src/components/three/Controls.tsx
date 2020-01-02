import React, { useEffect, useRef } from "react";
import { useThree } from "react-three-fiber";
import { useRender } from "react-three-fiber";
import * as THREE from "three";
import { Camera, Vector2, Vector3 } from "three";
import { MapControls } from "three/examples/jsm/controls/OrbitControls";

const LOCAL_STORAGE_KEY = "worldpos";
const DEFAULT_CAMERA_POS = new THREE.Vector3(-50, 150, 50);

export interface Props {
  scrollToPosition?: Vector2;
  onCameraMove: (camera: Camera, controls: MapControls) => void;
}

const Controls = (props: Props) => {
    const { camera } = useThree();
    const controls = useRef<MapControls>();

    useEffect(() => {
      const mapControls = new MapControls( camera );
      mapControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
      mapControls.dampingFactor = 0.05;
      mapControls.screenSpacePanning = true;
      mapControls.minDistance = 1;
      mapControls.maxDistance = 250;
      mapControls.maxPolarAngle = Math.PI / 2;
      mapControls.target = new THREE.Vector3(0, 0, 0);
      // mapControls.enableRotate = false;
      // mapControls.enableZoom = false;
      controls.current = mapControls;

      camera.position.copy(DEFAULT_CAMERA_POS);
      if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
        const savedCamera = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!);

        // Restore earlier saved position
        if (savedCamera) {
          camera.position.copy( savedCamera.cam );
          mapControls.target.copy( savedCamera.target );
        }
      }
    }, [camera]);

    useEffect(() => {
      if (controls.current && props.scrollToPosition) {
        const { x, y } = props.scrollToPosition!;
        const target =  new Vector3(x, 0, y);
        controls.current!.target = target;
        // console.log(target.cross(DEFAULT_CAMERA_POS));
        camera.position.copy(new Vector3(x + DEFAULT_CAMERA_POS.x, DEFAULT_CAMERA_POS.y, DEFAULT_CAMERA_POS.z + y));
      }
      return () => {
        if (controls.current) {
          // We have to explictly disable controls or drag drop won't work anymore
          controls.current.enabled = false;
        }
      };
    }, [props.scrollToPosition]);

    useRender(() => {
      if (controls.current) {
        controls.current.update();
      }

      if (mouseDown.current || true) {
        props.onCameraMove(camera, controls.current!);

        // todo: save in redux or just here?
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          cam: camera.position,
          target: controls.current!.target,
        }));
      }
    }, false);

    //
    const mouseDown = useRef<boolean>(false);
    useEffect(() => {
      const handleMouseDown = () => {
        mouseDown.current = true;
      };

      const handleMouseUp = () => {
        mouseDown.current = false;
      };

      document.addEventListener("mousedown", handleMouseDown);
      document.addEventListener("mouseup", handleMouseUp);
      
      return () => {
        document.removeEventListener("mousedown", handleMouseDown);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, []);

    return null;
};

export default Controls;
