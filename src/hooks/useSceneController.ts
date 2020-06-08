import { useStore } from 'react-redux';
import { SceneControllerManager } from 'global/SceneControllerManager';
import { useEffect, useState, useMemo } from 'react';

export const useSceneController = (questName: string, sceneName: string) => {
    const store = useStore();
    const controller = useMemo(() => (
        SceneControllerManager.getSceneController(questName, sceneName, store)
    ), [questName, sceneName, store]);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        if (sceneName) {
            setLoaded(false);
            const loadingComplete = () => {
                setLoaded(true);
                controller.createScene();
            }
            controller.loadData(loadingComplete);
        }
    }, [controller, questName, sceneName]);

    return { controller, loaded };
}