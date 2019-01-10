// tslint:disable:object-literal-sort-keys

export interface QuestStoreState {
    name: string;
    party: string[];        // List of adventurer ids
    progress: number;       // Which questnode the party is at currently
    questVars: object;
    encounterResults: string[];   // Store what option the place chose during an encounter
    log: string[];          // Quest log as strings
}

export const initialState: QuestStoreState = {
    name: "",
    party: [],
    progress: 0,
    questVars: {},
    encounterResults: [],
    log: [],
};
