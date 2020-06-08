import { Store, AnyAction } from "redux";
import { StoreState } from 'stores';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';

export abstract class SceneControllerManager {
    static store: { [key: string]: BaseSceneController } = {};
    static controllerTypes = {};
    
    static registerSceneController(questName: string, sceneName: string, controllerType: typeof BaseSceneController) {
        this.controllerTypes[`${questName}.${sceneName}`] = controllerType;
    }

    static getSceneController(questName: string, sceneName: string, store: Store<StoreState, AnyAction>,): BaseSceneController {
        if (!this.store[`${questName}.${sceneName}`]) {
            if (!this.controllerTypes[`${questName}.${sceneName}`]) {
                console.log(this.controllerTypes)
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
