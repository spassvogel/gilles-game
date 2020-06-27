import { useStore } from 'react-redux';
import { SceneControllerManager } from 'global/SceneControllerManager';
import { useEffect, useState, useMemo } from 'react';
import { StoreState } from 'stores';

export const useSceneController = (questName: string, sceneName: string) => {
    const store = useStore<StoreState>();
    const controller = useMemo(() => (
        SceneControllerManager.getSceneController(questName, sceneName, store)
    ), [questName, sceneName, store]);
    const [loaded, setLoaded] = useState<boolean>(false);

    const storeState = store.getState();
    const quest = storeState.quests.find(q => q.name === questName)!;
    const {scene} = quest;

    useEffect(() => {
        if (sceneName) {
            setLoaded(false);
            const loadingComplete = () => {
                setLoaded(true);

                // If the store has no scene for this quest yet, create and store it!
                if (!scene) {
                    controller.createScene();
                }
            }
            controller.loadData(loadingComplete);
        }
    }, [controller, questName, scene, sceneName]);

    return { controller, loaded };
}