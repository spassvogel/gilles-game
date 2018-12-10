    // tslint:disable:object-literal-sort-keys

export interface QuestStoreState {
    questDefinition: string;
    party: string[];        // List of adventurer ids
    progress: number;       // Which questnode the party is at currently
    questVars: object;
}

export const initialState: QuestStoreState = {
    questDefinition: "",
    party: [],
    progress: 0,
    questVars: {}
};
