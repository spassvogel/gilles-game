// tslint:disable:object-literal-sort-keys

import { ProductionDefinition } from "src/definitions/production/types";

export enum ActionType {
    advanceQuest = "advanceQuest",
}

export interface Action {
    type: ActionType;
}

export interface QuestAction extends Action {
    questName: string;
}


export function advanceQuest(quest: string): QuestAction {
    return {
        type: ActionType.advanceQuest,
        questName: quest,
    };
}

