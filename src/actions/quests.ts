import { Action } from "redux";
import { AdventurerStoreState } from "stores/adventurer";
import { SceneAction, SceneStoreState, TileObject } from 'stores/scene';
import { Item } from 'definitions/items/types';

// tslint:disable:object-literal-sort-keys

export enum ActionType {
    launchQuest = "launchQuest",                            // Embark upon a new quest
    updateQuestVars = "updateQuestVars",                    // ?
    updateEncounterResult = "updateEncounterResult",        // unused?
    startEncounter = "startEncounter",                      // unused! remove
    setSceneName = "setSceneName",                          // Sets name of the current scene of a quest
    setScene = "setScene",                                  // Fills in the scene of a quest
    exitEncounter = "exitEncounter",                        // Encounter is complete, leave scene and continue on quest
    updateQuests = "updateQuests",                          // unused! remove
    enqueueSceneAction = "enqueueSceneAction",
    completeSceneAction = "completeSceneAction",
    updateSceneObjectAction = "updateSceneObjectAction",    // Updates a tile object on the scene. Can update any property except 'id'
    setActiveLootCache = "setActiveLootCache",              // Sets the active loot cache (displays a modal)
    takeGoldFromCache = "takeGoldFromCache",                // Takes *all* the gold from a cache
    takeItemFromCache = "takeItemFromCache"                 // Takes an item from a cache
}

export interface QuestAction extends Action<ActionType> {
    questName: string;
}

export interface QuestVarsAction extends QuestAction {
    vars: any;
}

export interface QuestLaunchAction extends QuestAction {
    assignedAventurers: AdventurerStoreState[];
}

export interface SetSceneNameAction extends QuestAction {
    sceneName: string;
}

export interface SetSceneAction extends QuestAction {
    scene: SceneStoreState;
}

export interface EnqueueSceneActionAction extends QuestAction {
    sceneAction: SceneAction;
}

export interface UpdateEncounterResultAction extends QuestAction {
    nodeIndex: number;
    result: string;
}

export interface TakeGoldFromCacheAction extends QuestAction {
    cacheName: string;
}
export interface SetActiveLootCacheAction extends QuestAction {
    cacheName?: string;
}

export interface TakeItemFromCacheAction extends QuestAction {
    cacheName: string;
    item: Item;
}

export interface UpdateSceneObjectAction extends QuestAction {
    id: number;
    object: Partial<Omit<TileObject, 'id'>>;
}

export function launchQuest(questName: string, assignedAventurers: AdventurerStoreState[]): QuestLaunchAction {
    return {
        type: ActionType.launchQuest,
        questName,
        assignedAventurers,
    };
}

/** Completes the current encounter so the party can continue the quest */
export function exitEncounter(quest: string): QuestAction {
    return {
        type: ActionType.exitEncounter,
        questName: quest,
    };
}

export function updateQuestVars(quest: string, vars: any): QuestVarsAction {
    return {
        type: ActionType.updateQuestVars,
        questName: quest,
        vars,
    };
}

// Scene stuff

export function setSceneName(questName: string, sceneName: string): SetSceneNameAction {
    return {
        type: ActionType.setSceneName,
        questName,
        sceneName,
    };
}

export function setScene(questName: string, scene: SceneStoreState): SetSceneAction {
    return {
        type: ActionType.setScene,
        questName,
        scene,
    };
}

export function enqueueSceneAction(quest: string, sceneAction: SceneAction): EnqueueSceneActionAction {
    return {
        type: ActionType.enqueueSceneAction,
        questName: quest,
        sceneAction,
    };
}

export function completeSceneAction(quest: string): QuestAction {
    return {
        type: ActionType.completeSceneAction,
        questName: quest,
    };
}

export const updateSceneObjectAction = (questName: string, id: number, object: Partial<Omit<TileObject, 'id'>>): UpdateSceneObjectAction => {
    return {
        type: ActionType.updateSceneObjectAction,
        questName,
        id,
        object
    };
}

export function updateEncounterResult(quest: string, nodeIndex: number, result: string): UpdateEncounterResultAction {
    return {
        type: ActionType.updateEncounterResult,
        questName: quest,
        nodeIndex,
        result,
    };
}

export const takeGoldFromCache = (questName: string, cacheName: string): TakeGoldFromCacheAction => {
   return {
       type: ActionType.takeGoldFromCache,
       questName,
       cacheName
   }
}

export const setActiveLootCache = (questName: string, cacheName?: string): SetActiveLootCacheAction => {
   return {
       type: ActionType.setActiveLootCache,
       questName,
       cacheName
   }
}

export const takeItemFromCache = (questName: string, cacheName: string, item: Item): TakeItemFromCacheAction => {
   return {
       type: ActionType.takeItemFromCache,
       questName,
       cacheName,
       item
   }
}