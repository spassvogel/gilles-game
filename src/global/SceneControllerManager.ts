import { Store, AnyAction } from "redux";
import { StoreState } from 'store/types';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';

export abstract class SceneControllerManager {
    static store: { [key: string]: BaseSceneController<unknown> } = {};
    static controllerTypes: {[key: string]: typeof BaseSceneController} = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static registerSceneController(questName: string, sceneName: string, controllerType: any) {
        this.controllerTypes[`${questName}.${sceneName}`] = controllerType;
    }

    /**
     * Gets the scenecontroller for scene. Creates it if it doesnt exist
     */
    static getSceneController(questName: string, sceneName: string, store: Store<StoreState, AnyAction>): BaseSceneController<unknown> {
        if (!this.store[`${questName}.${sceneName}`]) {
            if (!this.controllerTypes[`${questName}.${sceneName}`]) {
                throw new Error(`No controller registered for ${questName}.${sceneName}`);
            }
            this.store[`${questName}.${sceneName}`] = new this.controllerTypes[`${questName}.${sceneName}`](store, questName);
        }
        return this.store[`${questName}.${sceneName}`];
    }

    static destroySceneConroller(questName: string, sceneName: string, ) {
        delete this.store[`${questName}.${sceneName}`];
    }
}

require('definitions/quests/kill10Boars/encounters/dungeon');
