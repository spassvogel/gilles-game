import { Stage, Sprite } from '@inlet/react-pixi';

import Controls from "components/three/Controls";
import Sphere from "components/three/debug/Sphere";
import DebugInspector from "components/three/DebugInspector";
import { getDefinition } from "definitions/quests";
import React, { createRef, useEffect, useRef, useState } from "react";
import { Canvas, Dom } from "react-three-fiber";
import { QuestStoreState } from "stores/quest";
import { Camera, Object3D, Raycaster, Vector2, Vector3, Euler } from "three";
import useTraceUpdate from "use-trace-update";
import { Suspense } from 'react'
import Cube from "../debug/Cube";
import Guy from "./Guy";
import Structure from "./structures/Structure";

const terrainRotation = new Euler(-90 * (Math.PI / 180), 0, 0);
const terrainScale = new Vector3(40, 40, 40);
const townPos = new Vector3(0, 0, 0);
const WIDTH = 648;
const HEIGHT = 690;

export interface Props {
  quests: QuestStoreState[];
  compassCenter: Vector2; // compass center in 2d UI coordinate system
  scrollToPosition?: Vector2;
  activeQuests: QuestStoreState[];
  selectedQuest?: string;
  controllerEnabled: boolean;
  onMapMove: (distance: number, angle: number) => void;
  onPartyClick: (questName: string) => void;
}

// tslint:disable-next-line: no-empty-interface
export interface DispatchProps {
  // onAdvanceQuest: (questName: string) => void;
}

type AllProps = Props & DispatchProps;

const WorldMap = (props: AllProps) => {

    const handleClick = (object: Object3D) => {
        // console.log(object);
    };

    const handleCameraMove = (camera: Camera) => {
        // the position of the compass as if it was in 3d space
        // const { x, z } = unproject(camera, props.compassCenter);

        // // Calculate the distance and angle between the town and the virtual compass in 3d space
        // const compassPos = new Vector2(x, z);
        // const distance = compassPos.distanceTo(new Vector2(townPos.x, townPos.z));
        // const angle = compassPos.angle(); // This only works because our town is at 0, 0

        // props.onMapMove(distance, angle);
    };

    const handlePartyClick = (name: string) => {
        props.onPartyClick(name);
    };

    const renderParties = () => {
        return props.activeQuests.map((quest, index) => {
            return (
                <div key={quest.name}>{quest.name}</div>
                // <Cube
                //     key={quest.name}
                //     size={[1, 1, 1]}
                //     position={questPosition}
                //     color={quest.name === props.selectedQuest ? "white" : "red"}
                //     onClick={() => handlePartyClick(quest.name)}
                //     ref={questCubesRef.current[index]}
                // />
            );
        });
    };


    // useEffect(() => {
    //     // This actually makes the cube pop in so is less than ideal
    //     props.activeQuests.forEach((quest, index) => {
    //         const position = getQuestWorldPosition(quest, terrainRef.current);
    //         (questCubesRef.current[index].current!).position.copy(position);
    //     });
    //     // console.log(questCubesRef.current[0].current)
    //     // questCubesRef.current.map(({current}) => {
    //     //     if (current) {
    //     //         const position = determineY(current.position, terrainRef.current!);
    //     //         current.position.copy(position);
    //     //     }
    //     // });
    // }, []);

    return (
        <div>aaa
        {renderParties()}
        <Stage>
            <Sprite image={`${process.env.PUBLIC_URL}img/world/francesca-baerald-fbaerald-angeloumap-lowres.jpg`} x={100} y={100} />
        </Stage>
        </div>
        // <Canvas style={{ height: HEIGHT, width: WIDTH }} camera={{ fov: 10 }} >
        //     <Suspense fallback={null}>
        //         <DebugInspector />
        //         {props.controllerEnabled && <Controls onCameraMove={handleCameraMove} scrollToPosition={props.scrollToPosition} />}
        //         <WorldMapTerrain rotation={terrainRotation} scale={terrainScale} ref={terrainRef}/>
        //         <Sphere onClick={handleClick} position={[62, 0, 14]} name="party1" />
        //         {renderParties()}
        //         <Cube size={[1, 1, 1]} position={[0, 0, 1]} color="blue"/>
        //         <Cube size={[1, 1, 1]} position={[1, 0, 2]} color="blue"/>
        //         <Guy url="models/westernkingdoms/models/WK_worker.FBX" position={[1, 1, 1]} />

        //         <Structure url="models/world/human/house_atlas.fbx" position={[10, 0, 0]}/>
        //         <Structure url="models/world/human/smithy_atlas.fbx" position={[20, 0, 10]}/>
        //     </Suspense>
        // </Canvas>
    );
};

export default WorldMap;
