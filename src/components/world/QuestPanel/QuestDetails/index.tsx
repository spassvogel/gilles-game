import React, { useEffect, useCallback, useState } from 'react';
import Scene from 'components/world/QuestPanel/QuestDetails/Scene';
import { useSelector, useStore } from 'react-redux';
import { StoreState } from 'stores';
import { QuestStoreState } from 'stores/quest';
import { SceneControllerManager } from 'global/SceneControllerManager';
import { useSceneController } from 'hooks/useSceneController';
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

    if (!quest.sceneName) {
        return null;
    }

    return (
        <SceneLoader {...props} sceneName={quest.sceneName} scene={quest.scene} />
    );
}

export default QuestDetails;

type SceneLoaderProps = Props & { 
    sceneName: string;
    scene?: SceneStoreState;
}
const SceneLoader = (props: SceneLoaderProps) => {
    const { controller, loaded }  = useSceneController(props.questName, props.sceneName);
    if (!props.scene || !loaded) {
        console.log('not loaded')
        return null;
    }
    return (
        <Scene {...props} controller={controller} />
    )
}
