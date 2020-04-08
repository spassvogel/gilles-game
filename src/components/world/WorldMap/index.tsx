import * as PIXI from 'pixi.js';
import { Stage, Sprite } from '@inlet/react-pixi';
import { Viewport as PixiViewport } from "pixi-viewport";
import { useSelector } from 'react-redux'

import React, { useEffect, useRef, useCallback } from "react";
import { QuestStoreState } from "stores/quest";
import { lerpLocation } from 'utils/pixiJs';
import questDefinitions, { QuestDefinition, QuestNodeType, QuestNode } from "definitions/quests";
import Viewport from '../../pixi/Viewport';
import MapGrid from './MapGrid';
import QuestMarker from './QuestMarker';
import { StoreState } from 'stores';
import { getQuestLeader } from 'storeHelpers';
import { AdventurerStoreState } from 'stores/adventurer';
import QuestLine from './QuestLine';
import { MAX_WIDTH as WIDTH } from 'components/App';
import { selectActiveQuests } from 'selectors/quests';
import { getDefinition } from 'definitions/quests';

const FULL_HEIGHT = 1024;
const SMALL_HEIGHT = 128;   // Used when QuestPanel is open
const WORLD_WIDTH = 1500;
const WORLD_HEIGHT = 1061;
const GRID_WIDTH = 10;      // width or height of each node location in pixels

// // This stuff is needed for the pixi-js browser plugin
if (process.env.NODE_ENV === "development") {
    // @ts-ignore
    window.__PIXI_INSPECTOR_GLOBAL_HOOK__ && window.__PIXI_INSPECTOR_GLOBAL_HOOK__.register({ PIXI: PIXI });
}

export interface Props {
    selectedQuestName?: string;
    controllerEnabled: boolean;
    smallMap: boolean;
    onPartyClick: (questName: string) => void;
}


const WorldMap = (props: Props) => {
    const questSelector = useCallback(
        (state: StoreState) => state.quests.find((q) => q.name === props.selectedQuestName), 
        [props.selectedQuestName]
    );
    const selectedQuest = useSelector<StoreState, QuestStoreState | undefined>(questSelector);

    const adventurers = useSelector<StoreState, AdventurerStoreState[]>((store) => store.adventurers);
    const activeQuests = useSelector<StoreState, QuestStoreState[]>((store) => selectActiveQuests(store));

    const handlePartyClick = (name: string) => {
        props.onPartyClick(name);
    };

    useEffect(() => {
        if (selectedQuest) {
            focusOnQuestingParty(selectedQuest);
        }
    }, [selectedQuest]);

    const renderQuestlines = () => {
        return activeQuests.map((quest) => {
            const previousPositions = getPreviousPositions(quest);
            return (
                <QuestLine positions={previousPositions} key={quest.name} />
            );
        });
    };

    const renderMarkers = () => {
        return activeQuests.map((quest) => {
            const location = getQuestWorldLocation(quest);
            const currentPosition = nodeLocationToPoint(location);
            const leader = getQuestLeader(adventurers, quest)!;
            const questDefinition: QuestDefinition = getDefinition(quest.name);
            const progress: number = Math.floor(quest.progress);
            const questNode: QuestNode = questDefinition.nodes[progress];
            
            return (
                <QuestMarker 
                    quest={quest} 
                    leader={leader} 
                    position={currentPosition} 
                    key={quest.name} 
                    selected={quest === selectedQuest}
                    encounterActive={questNode.type === QuestNodeType.encounter}
                    onClick={(quest) => handlePartyClick(quest.name)} 
                />
            );
        });
    };

    const ref = useRef<PixiViewport>(null);
    useEffect(() => {
        // focus on center of the map
        if (ref.current) {
            const viewport = ref.current;
            const point = nodeLocationToPoint({ x: 0, y: 0 });
            viewport.moveCenter(point.x, point.y);
        }
    }, []);

    // puts the given party in the center of the map
    const focusOnQuestingParty = (quest: QuestStoreState) => {
        const viewport = ref.current;
        if (viewport) {
            const partyLocation = getQuestWorldLocation(quest);
            const point = nodeLocationToPoint(partyLocation);
            viewport.moveCenter(point.x, point.y);
        }
    }

    const height = props.smallMap ? SMALL_HEIGHT : FULL_HEIGHT;

    return (
        <Stage width={WIDTH} height={height}>
            <Viewport screenWidth={WIDTH} screenHeight={height} worldWidth={WORLD_WIDTH} worldHeight={WORLD_HEIGHT} ref={ref} >
                <Sprite image={`${process.env.PUBLIC_URL}/img/world/francesca-baerald-fbaerald-angeloumap-lowres.jpg`} >
                    {renderQuestlines()}
                    {renderMarkers()}
                </Sprite>
                {/* <MapGrid width={WORLD_WIDTH} height={WORLD_HEIGHT} gridWidth={GRID_WIDTH} /> */}
            </Viewport>
        </Stage>
    );
};



export default WorldMap;

const getQuestWorldLocation = (quest: QuestStoreState): { x: number; y: number; } => {
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

    for (let i = 0; i < quest.progress; i++) {
        positions.push(nodeLocationToPoint(questDefinition.nodes[i]))
    }
    const lastPosition = nodeLocationToPoint(getQuestWorldLocation(quest));
    positions.push(lastPosition);
    return positions;
}