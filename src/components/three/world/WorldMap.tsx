import * as PIXI from 'pixi.js';
import { Stage, Sprite } from '@inlet/react-pixi';

import Controls from "./Controls";
import Sphere from "components/three/debug/Sphere";
import DebugInspector from "components/three/DebugInspector";
import { getDefinition } from "definitions/quests";
import React, { createRef, useEffect, useRef, useState } from "react";
import { QuestStoreState } from "stores/quest";
import { lerpPoint } from 'utils/pixiJs';
import { eventNames } from 'cluster';

const WIDTH = 648;
const HEIGHT = 690;

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
            const position = getQuestWorldPosition(quest);
            
            return (
                <Sprite 
                    image={`${process.env.PUBLIC_URL}/img/cursors/dwarven_gauntlet.png`} name="cursor" 
                    x={position.x * 50}
                    y={position.y * 50}
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
        <Stage 
            width={WIDTH} 
            height={HEIGHT}
        >
            <Controls />
            <Sprite 
                image={`${process.env.PUBLIC_URL}/img/world/francesca-baerald-fbaerald-angeloumap-lowres.jpg`}          
            >
                {renderParties()}
            </Sprite>
        </Stage>
    );
};

export default WorldMap;

const getQuestWorldPosition = (quest: QuestStoreState): PIXI.Point => {
    const questDefinition = getDefinition(quest.name);
    const roundedProgress = Math.floor(quest.progress);
    const lastNode = questDefinition.nodes[roundedProgress];
    const lastPosition = new PIXI.Point(lastNode.x, lastNode.y);

    const nextNode = questDefinition.nodes[roundedProgress + 1];
    if (!nextNode) {
        // We've reached the last node
        return lastPosition;
    }
    const nextPosition = new PIXI.Point(nextNode.x, nextNode.y);
    return lerpPoint(lastPosition, nextPosition, quest.progress - roundedProgress);
};