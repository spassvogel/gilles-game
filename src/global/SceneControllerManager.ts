import { Store, AnyAction } from "redux";
import { StoreState } from 'store/types';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';

export abstract class SceneControllerManager {
    static store: { [key: string]: BaseSceneController<any> } = {};
    static controllerTypes: {[key: string]: typeof BaseSceneController} = {};

    static registerSceneController(questName: string, sceneName: string, controllerType: typeof BaseSceneController) {
        this.controllerTypes[`${questName}.${sceneName}`] = controllerType;
    }

    /**
     * Gets the scenecontroller for scene. Creates it if it doesnt exist
     */
    static getSceneController<TQuestVars>(questName: string, sceneName: string, store: Store<StoreState, AnyAction>): BaseSceneController<TQuestVars> {
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

// tslint:disable-next-line: no-var-requires
require('definitions/quests/kill10Boars/encounters/dungeon');
