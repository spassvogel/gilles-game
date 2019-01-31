import { Encounter } from "src/definitions/encounters";

// tslint:disable:object-literal-sort-keys

export interface QuestStoreState {
    name: string;
    party: string;          // Reference to PartyStoreState.id
    progress: number;       // Which questnode the party is at currently
    questVars: object;
    encounterResults: string[];   // Store what option the place chose during an encounter // OBSOLETE
    log: string[];          // Quest log as strings
    currentEncounter: Encounter | null;
}

export const initialState: QuestStoreState = {
    name: "",
    party: "",
    progress: 0,
    questVars: {},
    encounterResults: [],
    log: [],
    currentEncounter: null,
};
