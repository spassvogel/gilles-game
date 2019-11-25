// It's a js file because there is some problem with the
import React, { useEffect } from 'react'
import { useThree } from 'react-three-fiber'
import * as THREE from 'three'

function DebugInspector(props/*: ModelProps | any*/) {
    const { scene } = useThree();

    useEffect(() => {
      if (!window.scene) { window.scene = scene; }
      window.THREE = THREE;
    }, []);

    return null;
}

export default DebugInspector;
