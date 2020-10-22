import React, { createContext, PropsWithChildren, useState, useMemo, useEffect } from 'react';
import { SceneControllerManager } from 'global/SceneControllerManager';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { useStore } from 'react-redux';
import { StoreState } from 'store/types';

export const SceneControllerContext = createContext<BaseSceneController<any> | null>(null);

export interface Props {
    questName: string;
}

const SceneControllerContextProvider = (props: PropsWithChildren<Props>) => {
    const {questName, children} = props;
    const store = useStore<StoreState>();
    const [loaded, setLoaded] = useState<boolean>(false);
    const storeState = store.getState();
    const quest = storeState.quests.find(q => q.name === questName)!;
    const {scene, sceneName} = quest;

    const controller = useMemo(() => {
        if (!sceneName) {
            return null;
        }
        return SceneControllerManager.getSceneController(questName, sceneName, store);
    }, [questName, sceneName, store]);

    useEffect(() => {
        if (sceneName && controller) {
            setLoaded(false);
            const loadingComplete = () => {
                setLoaded(true);

                // If the store has no scene for this quest yet, create and store it!
                if (!scene && controller) {
                    controller.createScene();
                    controller.sceneEntered();
                }
            }
            controller.loadData(loadingComplete);
        }
    }, [controller, questName, scene, sceneName]);

    if (controller && (!controller.dataLoaded || !loaded)) {
        return (
            <div>loading...</div>
        );
    }
    return (
        <SceneControllerContext.Provider value={controller}>
            {children}
        </SceneControllerContext.Provider>
    );
};

export default SceneControllerContextProvider;