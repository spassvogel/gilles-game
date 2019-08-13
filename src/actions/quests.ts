import { Encounter } from "definitions/encounters/types";
import { Action } from "redux";
import { AdventurerStoreState } from "stores/adventurer";

// tslint:disable:object-literal-sort-keys

export enum ActionType {
    launchQuest = "launchQuest",
    advanceQuest = "advanceQuest",
    updateQuestVars = "updateQuestVars",
    updateEncounterResult = "updateEncounterResult",
    startEncounter = "startEncounter",
    updateQuests = "updateQuests",
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
    encounter: Encounter;
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

export function startEncounter(quest: string, encounter: Encounter): StartEncounterAction {
    return {
        type: ActionType.startEncounter,
        questName: quest,
        encounter,
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
