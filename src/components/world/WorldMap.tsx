import * as PIXI from 'pixi.js';
import { Stage, Sprite } from '@inlet/react-pixi';
import { Viewport as PixiViewport} from "pixi-viewport";
import { useSelector } from 'react-redux'

import { getDefinition } from "definitions/quests";
import React, { useEffect, useRef, useMemo } from "react";
import { QuestStoreState, QuestStatus } from "stores/quest";
import { lerpLocation } from 'utils/pixiJs';
import Viewport from '../pixi/Viewport';
import MapGrid from './MapGrid';
import QuestMarker from './QuestMarker';
import { StoreState } from 'stores';
import { getQuestLeader } from 'storeHelpers';
import { AdventurerStoreState } from 'stores/adventurer';
import QuestLine from './QuestLine';
import { MAX_WIDTH as WIDTH } from 'components/App';

const HEIGHT = 1024;
const WORLD_WIDTH = 1500;
const WORLD_HEIGHT = 1061;
const GRID_WIDTH = 10;      // width or height of each node location in pixels

// // This stuff is needed for the pixi-js browser plugin
if (process.env.NODE_ENV === "development") {
//     // @ts-ignore
//     PIXI.useDeprecated();
    // @ts-ignore
    window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
}

export interface Props {
  //quests: QuestStoreState[];
  //activeQuests: QuestStoreState[];
  selectedQuest?: string;
  controllerEnabled: boolean;
  onMapMove: (distance: number, angle: number) => void;
  onPartyClick: (questName: string) => void;
}

interface StateProps {
    adventurers: AdventurerStoreState[];
    quests: QuestStoreState[];
}

// tslint:disable-next-line: no-empty-interface
export interface DispatchProps {
  // onAdvanceQuest: (questName: string) => void;
}

type AllProps = Props & DispatchProps;
//let scale = new PIXI.Point(1, 1);

const WorldMap = (props: AllProps) => {

    const storeProps = useSelector<StoreState, StateProps>((state: StoreState) => {
        return {
            adventurers: state.adventurers,
            quests: state.quests,
            activeQuests: state.quests
        };
    });

    const activeQuests = useMemo(() => {
        return storeProps.quests.filter((q) => q.status === QuestStatus.active);
    }, [storeProps.quests]);

    const handlePartyClick = (name: string) => {
        props.onPartyClick(name);
    };

    const renderQuestlines = () => {
        return activeQuests.map((quest, index) => {
            const previousPositions = getPreviousPositions(quest);
            return (
                <QuestLine positions={previousPositions} key={quest.name}/>
            );
        });
    };

    const renderMarkers = () => {
        return activeQuests.map((quest, index) => {
            const location = getQuestWorldLocation(quest);
            const currentPosition = nodeLocationToPoint(location);
            const leader = getQuestLeader(storeProps.adventurers, quest)!;
            return (
                <QuestMarker quest={quest} leader={leader} position={currentPosition} key={quest.name} onClick={(quest) => handlePartyClick(quest.name)}/>
            );
        });
    };

    const ref = useRef<PixiViewport>(null);
    useEffect(() => {
        if(ref.current) {
            const viewport = ref.current;
            const point = nodeLocationToPoint({ x: 0, y: 0});
            viewport.moveCenter(point.x, point.y);
        }
    }, []);

    return (
        <Stage width={WIDTH} height={HEIGHT}>
            <Viewport screenWidth={WIDTH} screenHeight={HEIGHT} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} ref={ref} >
                <Sprite image={`${process.env.PUBLIC_URL}/img/world/francesca-baerald-fbaerald-angeloumap-lowres.jpg`} >
                    {renderQuestlines()}
                    {renderMarkers()}
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

// Node locations work on a centered coordinate system
const nodeLocationToPoint = (location: { x: number; y: number; }) => {
    const x = location.x * GRID_WIDTH + WORLD_WIDTH / 2;
    const y = location.y * GRID_WIDTH + WORLD_HEIGHT / 2;
    return new PIXI.Point(x, y);
}

const getPreviousPositions = (quest: QuestStoreState) => {
    const positions: PIXI.Point[] = [];
    const questDefinition = getDefinition(quest.name);

    for(let i = 0; i < quest.progress; i++) {
        positions.push(nodeLocationToPoint(questDefinition.nodes[i]))
    }
    const lastPosition = nodeLocationToPoint(getQuestWorldLocation(quest));
    positions.push(lastPosition);
    return positions;
}