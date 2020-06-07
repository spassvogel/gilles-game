import React, { useEffect, useCallback, useState } from 'react';
import Scene from 'components/world/QuestPanel/QuestDetails/Scene';
import { useSelector, useStore } from 'react-redux';
import { StoreState } from 'stores';
import { QuestStoreState } from 'stores/quest';
import { SceneControllerManager } from 'definitions/quests/kill10Boars/encounters/dungeon';

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

    const store = useStore();
    const controller = SceneControllerManager.getSceneController(quest.sceneName!, props.questName, store);
    const [dataLoaded, setDataLoaded] = useState<boolean>(controller.dataLoaded);

    useEffect(() => {
        if (!dataLoaded && quest.sceneName) {
            const loadingComplete = () => {
                setDataLoaded(true);
                controller.createScene();
                //console.log(`finished loading, do we have scene? ${quest.sceneName} ${quest.scene}`)
            }
            controller.loadData(loadingComplete);
        }
    }, [controller, dataLoaded, quest.sceneName]);

    if (!dataLoaded || !quest.scene) {
        return null;
    }

    return (
        <Scene {...props} controller={controller} />
    );
}

export default QuestDetails;

