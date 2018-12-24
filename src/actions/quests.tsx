// tslint:disable:object-literal-sort-keys

import { ProductionDefinition } from "src/definitions/production/types";

export enum ActionType {
    advanceQuest = "advanceQuest",
    updateQuestVars = "updateQuestVars",
    updateEncounterResult = "updateEncounterResult",
}

export interface Action {
    type: ActionType;
}

export interface QuestAction extends Action {
    questName: string;
}

export interface QuestVarsAction extends QuestAction {
    vars: any;
}
export interface UpdateEncounterResultAction extends QuestAction {
    nodeIndex: number;
    result: string;
}

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

export function updateEncounterResult(quest: string, nodeIndex: number, result: string): UpdateEncounterResultAction {
    return {
        type: ActionType.updateEncounterResult,
        questName: quest,
        nodeIndex,
        result,
    };
}
