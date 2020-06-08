import { useStore } from 'react-redux';
import { SceneControllerManager } from 'global/SceneControllerManager';
import { useEffect, useState, useMemo } from 'react';

export const useSceneController = (questName: string, sceneName: string) => {
    const store = useStore();
    const controller = useMemo(() => (
        SceneControllerManager.getSceneController(questName, sceneName, store)
    ), [questName, sceneName, store]);
    const [loaded, setloaded] = useState<boolean>(controller.dataLoaded);

    useEffect(() => {
        if (!loaded && sceneName) {
            const loadingComplete = () => {
                setloaded(true);
                controller.createScene();
                console.log(`finished loading, do we have scene? ${questName} ${sceneName}`)
            }
            controller.loadData(loadingComplete);
        }
    }, [controller, loaded, questName, sceneName]);

    return { controller, loaded };
}