import { Encounter } from "src/definitions/encounters/types";
import { Item } from "src/definitions/items/types";

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
    party: string;          // Reference to PartyStoreState.id
                            // todo: perhaps refactor party to be part of QuestStoreState
    progress: number;       // Which questnode the party is at currently
    questVars: any;
    encounterResults: string[];   // Store what option the place chose during an encounter // OBSOLETE
    log: string[];          // Quest log as strings.
                            // todo: deprecate
    icon: string;

    currentEncounter: Encounter | null;
    reward?: QuestReward;
}
