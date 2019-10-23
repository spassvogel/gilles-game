// It's a js file because there is some problem with the 
import * as THREE from 'three'
import React, { useContext, useState, useRef } from 'react'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { AppContext } from "components/App";
import { Vector3 } from "three";
import { useThree } from 'react-three-fiber'
import { useRender } from 'react-three-fiber'

function Terrain(props/*: ModelProps | any*/) {

    const ref = useRef();
    const { scene, camera } = useThree();
    useRender(({ gl, scene, camera }) => {
        //console.log(camera)
        //console.log(ref.current)
       // if(ref.current) camera.lookAt(ref.current)
     //   gl.render(scene, camera)
    });

    //return array with height data from img
    const getHeightData = (img, scale = 1) => {   
        const canvas = document.createElement( 'canvas' );
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext( '2d' );
        
        const size = img.width * img.height;
        const data = new Float32Array( size );
        
        context.drawImage(img, 0, 0);
        
        for ( let i = 0; i < size; i ++ ) {
            data[i] = 0;
        }
        
        const imgData = context.getImageData(0, 0, img.width, img.height);
        const pix = imgData.data;
        
        let j = 0;
        for (let i = 0; i < pix.length; i += 4) {
            const all = pix[i]+pix[i+1]+pix[i+2];
            data[j++] = all/(12*scale);
        }
            
        return data;
    }
    
    if (props.heightmap) {
        if(!window.scene) window.scene = scene;

        const data = getHeightData(props.heightmap);
        const geometry = new THREE.PlaneGeometry(10,10,9,9);
        //const texture = props.heightmap;
        var material = new THREE.MeshLambertMaterial({
            vertexColors: THREE.FaceColors,
            color: 0x666666,
            flatShading: true
        })

        //set height of vertices
        for ( let i = 0; i < geometry.vertices.length; i++ ) {
            geometry.vertices[i].z = data[i];
        }
        //console.log('rendering')

        return <mesh 
            ref={ref}
            geometry={ geometry } material = { material } {...props}
        />
    }
    return null;     
    //console.log(getHeightData());

    
  //   const { url } = props;
  //   const [geometry, setGeometry] = useState();

  //   useMemo(() => {
  //     console.log("loading")
  //     new OBJLoader().load(url, (grp/*: Group*/) => {
  //       setGeometry((grp.children[0]/* as Mesh*/).geometry);
  //     });
  //   }, [url]);

  //   const cube = new THREE.Mesh( new THREE.CircleBufferGeometry( 200, 200, 200 ), new THREE.MeshNormalMaterial() );
  //   cube.position.y = 150;

  //   //return <primitive object={cube} position={[0, 0, 0]}></primitive>;
  //   return geometry ? <mesh 
  //     //onClick
  //     geometry={ geometry } {...props}
  //   >
  //     {/* <primitive object={cube} position={[0, 0, 0]}></primitive> */}
  //   <meshPhysicalMaterial
  //     attach="material"
  //     roughness={0.8}
  //     metalness={0.6}
  //     //emissive="#a4f20d"
  //     //emissiveIntensity={active ? 0.1 : 0}
  //     color="#1c1c1c"
  //     fog={true}
  //     //shininess={0.5}
  //   />
  // </mesh> : null;
}

export default Terrain;