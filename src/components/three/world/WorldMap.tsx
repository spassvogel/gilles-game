import * as PIXI from 'pixi.js';
import { Stage, Sprite } from '@inlet/react-pixi';

import Controls from "./Controls";
import Sphere from "components/three/debug/Sphere";
import DebugInspector from "components/three/DebugInspector";
import { getDefinition } from "definitions/quests";
import React, { createRef, useEffect, useRef, useState } from "react";
import { QuestStoreState } from "stores/quest";
import { lerpLocation } from 'utils/pixiJs';
import { eventNames } from 'cluster';
import Viewport from './Viewport';
import MapGrid from './MapGrid';

const WIDTH = 648;
const HEIGHT = 690;
const WORLD_WIDTH = 1500;
const WORLD_HEIGHT = 1061;
const GRID_WIDTH = 10;      // width or height of each node location in pixels

// This stuff is needed for the pixi-js browser plugin
if (process.env.NODE_ENV === "development") {
    // @ts-ignore
    PIXI.useDeprecated();
    // @ts-ignore
    window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
}

export interface Props {
  quests: QuestStoreState[];
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
//let scale = new PIXI.Point(1, 1);

const WorldMap = (props: AllProps) => {


//    const handleCameraMove = (camera: Camera) => {
        // the position of the compass as if it was in 3d space
        // const { x, z } = unproject(camera, props.compassCenter);

        // // Calculate the distance and angle between the town and the virtual compass in 3d space
        // const compassPos = new Vector2(x, z);
        // const distance = compassPos.distanceTo(new Vector2(townPos.x, townPos.z));
        // const angle = compassPos.angle(); // This only works because our town is at 0, 0

        // props.onMapMove(distance, angle);
//    };

    const handlePartyClick = (name: string) => {
        props.onPartyClick(name);
    };

    const renderParties = () => {
        return props.activeQuests.map((quest, index) => {
            const location = getQuestWorldLocation(quest);
            const point = nodeLocationToPoint(location);
console.log(point)
            return (
                <Sprite 
                    image={`${process.env.PUBLIC_URL}/img/cursors/dwarven_gauntlet.png`} 
                    name="cursor"
                    key={quest.name}
                    x={point.x}
                    y={point.y}
                    interactive={true}
                    pointerdown={() => {
                       // setScale(scale + 1);
                        handlePartyClick(quest.name)
                    }}
                />
            );
        });
    };

    return (
        <Stage width={WIDTH} height={HEIGHT}>
            <Viewport screenWidth={WIDTH} screenHeight={HEIGHT} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT}>
                <Sprite 
                    image={`${process.env.PUBLIC_URL}/img/world/francesca-baerald-fbaerald-angeloumap-lowres.jpg`}          
                >
                    {renderParties()}
                </Sprite>
                <MapGrid width={WORLD_WIDTH} height={WORLD_HEIGHT} gridWidth={GRID_WIDTH}/>
            </Viewport>
        </Stage>
    );
};



export default WorldMap;

const getQuestWorldLocation = (quest: QuestStoreState) => {
    const questDefinition = getDefinition(quest.name);
    const roundedProgress = Math.floor(quest.progress);
    const lastNode = questDefinition.nodes[roundedProgress];

    const nextNode = questDefinition.nodes[roundedProgress + 1];
    if (!nextNode) {
        // We've reached the last node
        return lastNode;
    }
    return lerpLocation(lastNode, nextNode, quest.progress - roundedProgress);
};

const nodeLocationToPoint = (location: { x: number; y: number; }) => {
    const x = location.x * GRID_WIDTH + WORLD_WIDTH / 2;
    const y = location.y * GRID_WIDTH + WORLD_HEIGHT / 2;
    return new PIXI.Point(x, y);
}