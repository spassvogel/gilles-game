import { Encounter } from "definitions/encounters/types";
import { Item } from "definitions/items/types";

export enum QuestStatus {
    unavailable,
    available,  // on the quest board
    active,
    completed,
    // todo: failed?
}

export interface QuestReward {
    gold?: number;
    items?: Item[];
}

export interface QuestStoreState {
    name: string;
    status: QuestStatus;
    party: string[];        // list of adventurer ids
    progress: number;       // Which questnode the party is at currently
    questVars: any;
    encounterResults: string[];   // Store what option the place chose during an encounter // OBSOLETE
    icon: string;

    currentEncounter: Encounter | null;
    reward?: QuestReward;
}