import React from 'react';
import Scene from 'components/world/QuestPanel/QuestDetails/Scene';
import { useSceneController } from 'hooks/useSceneController';
import { SceneStoreState } from 'stores/scene';
import useQuest from 'hooks/store/useQuest';

export interface Props {
    questName: string;
    selectedActor: string;
    setSelectedActor: (actor: string) => void;
    onLootCacheChanged: (value: string) => void;
}

const QuestDetails = (props: Props) => {
 //     {/* <h1 className="app-h2">{TextManager.getQuestTitle(quest.name)}</h1> */}

    const quest = useQuest(props.questName);

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

// Ensures a sceneController is present with tilemap data loaded and quest scene data is present on the store
const SceneLoader = (props: SceneLoaderProps) => {
    const { controller, loaded } = useSceneController(props.questName, props.sceneName);
    if (!props.scene || !loaded || !controller.mapData) {
        return null;
    }
    return (
        <Scene {...props} controller={controller} />
    )
}
