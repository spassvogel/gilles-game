import { Action } from "redux";
import { AdventurerStoreState } from "store/types/adventurer";
import { SceneAction, SceneStoreState, SceneObject, SceneInteractionModal } from "store/types/scene";
import { Item } from 'definitions/items/types';
import { PartialDeep } from "type-fest";

// tslint:disable:object-literal-sort-keys

export enum ActionType {
    launchQuest = "launchQuest",                            // Embark upon a new quest
    updateQuestVars = "updateQuestVars",                    // ?
    updateEncounterResult = "updateEncounterResult",        // unused?
    startEncounter = "startEncounter",                      // unused! remove
    setSceneName = "setSceneName",                          // Sets name of the current scene of a quest
    setScene = "setScene",                                  // Fills in the scene of a quest
    exitEncounter = "exitEncounter",                        // Encounter is complete, leave scene and continue on quest
    enqueueSceneAction = "enqueueSceneAction",
    completeSceneAction = "completeSceneAction",
    setCombat = "setCombat",                                // Sets combat status
    deductActorAp = "deductActorAp",
    updateSceneObjectAction = "updateSceneObjectAction",    // Updates a tile object on the scene. Can update any property except 'id'
    setActiveSceneInteractionModal = "setActiveSceneInteractionModal",     // Sets the active  modal
}

export interface QuestAction extends Action<ActionType> {
    questName: string;
}

export interface QuestVarsAction extends QuestAction {
    vars: PartialDeep<any>;
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

export interface DeductActorApAction extends QuestAction {
    actor: string;
    ap: number;
}

export interface SetCombatAction extends QuestAction {
    combat: boolean;
}

export interface UpdateEncounterResultAction extends QuestAction {
    nodeIndex: number;
    result: string;
}

export interface SetActiveSceneInteractionModalAction extends QuestAction {
    sceneInteractionModal?: SceneInteractionModal;
}

export interface TakeItemFromCacheAction extends QuestAction {
    cacheName: string;
    item: Item;
}

export interface UpdateSceneObjectAction extends QuestAction {
    id: number;
    object: Partial<Omit<SceneObject, 'id'>>;
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

export function updateQuestVars(quest: string, vars: PartialDeep<any>): QuestVarsAction {
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

export function setCombat(quest: string, combat: boolean): SetCombatAction {
    return {
        type: ActionType.setCombat,
        questName: quest,
        combat
    };
}

export function deductActorAp(quest: string, actor: string, ap: number): DeductActorApAction {
    return {
        type: ActionType.deductActorAp,
        questName: quest,
        actor,
        ap
    };
}

export const updateSceneObject = (questName: string, id: number, object: Partial<Omit<SceneObject, 'id'>>): UpdateSceneObjectAction => {
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

export const setActiveSceneInteractionModal = (questName: string, sceneInteractionModal?: SceneInteractionModal): SetActiveSceneInteractionModalAction => {
   return {
       type: ActionType.setActiveSceneInteractionModal,
       questName,
       sceneInteractionModal
   }
}
