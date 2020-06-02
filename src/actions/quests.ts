import { Action } from "redux";
import { AdventurerStoreState } from "stores/adventurer";
import { SceneAction, SceneStoreState } from 'stores/scene';

// tslint:disable:object-literal-sort-keys

export enum ActionType {
    launchQuest = "launchQuest",
    advanceQuest = "advanceQuest",
    updateQuestVars = "updateQuestVars",
    updateEncounterResult = "updateEncounterResult",
    startEncounter = "startEncounter",
    updateQuests = "updateQuests",
    enqueueSceneAction = "enqueueSceneAction",
    completeSceneAction = "completeSceneAction",
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

export interface StartEncounterAction extends QuestAction {
    scene: SceneStoreState;
}

export interface EnqueueSceneActionAction extends QuestAction {
    sceneAction: SceneAction;
}

export interface UpdateEncounterResultAction extends QuestAction {
    nodeIndex: number;
    result: string;
}

export function launchQuest(questName: string, assignedAventurers: AdventurerStoreState[]): QuestLaunchAction {
    return {
        type: ActionType.launchQuest,
        questName,
        assignedAventurers,
    };
}

/** Move to the next node */
export function advanceQuest(quest: string): QuestAction {
    return {
        type: ActionType.advanceQuest,
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

export function startEncounter(quest: string, scene: SceneStoreState): StartEncounterAction {
    return {
        type: ActionType.startEncounter,
        questName: quest,
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

export function updateEncounterResult(quest: string, nodeIndex: number, result: string): UpdateEncounterResultAction {
    return {
        type: ActionType.updateEncounterResult,
        questName: quest,
        nodeIndex,
        result,
    };
}
