import React, { useEffect, useCallback, useState } from 'react';
import Scene from 'components/world/QuestPanel/QuestDetails/Scene';
import { useSelector } from 'react-redux';
import { StoreState } from 'stores';
import { QuestStoreState } from 'stores/quest';
import { TiledMapData } from 'constants/tiledMapData';
import { loadResource } from 'utils/pixiJs';
import { SceneStoreState } from 'stores/scene';

export interface Props {
    questName: string;
    selectedActor: string;
    setSelectedActor: (actor: string) => void;
}

const QuestDetails = (props: Props) => {
       //     {/* <h1 className="app-h2">{TextManager.getQuestTitle(quest.name)}</h1> */}

    const questSelector = useCallback(
        (state: StoreState) => state.quests.find((q) => q.name === props.questName)!, 
        [props.questName]
    );

    const quest = useSelector<StoreState, QuestStoreState>(questSelector);
    const {scene} = quest;
    if (!scene) return null;

    return (
        <SceneWrapper scene={scene} {...props} />
    );
}

export default QuestDetails;

interface SceneWrapperProps { 
    scene: SceneStoreState;
}

const SceneWrapper = (props: SceneWrapperProps & Props) => {
    const {scene} = props;
    const jsonPath = `${process.env.PUBLIC_URL}/${scene.tilemap}`;
    const [mapData, setMapData] = useState<TiledMapData>();

    useEffect(() => {
        loadResource(jsonPath, (resource) => {
            const mapData: TiledMapData = resource.data;
            setMapData(mapData);    
        });
    }, [jsonPath]);

    if (!scene.tilemap) {
        console.error(`No tilemap defined!`);
    }

    const basePath = jsonPath.substr(0, jsonPath.lastIndexOf('/'));
    if (!mapData) return null;
    return (
        <Scene {...props} mapData={mapData} basePath={basePath} />
    );
}
