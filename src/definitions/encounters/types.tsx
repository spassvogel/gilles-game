import { StoreState } from "src/stores";

export interface EncounterDefinition<TQuestVars> {
    chance?: number;    // number from 0 to 1, undefined means: 1
    getTitle: (questVars?: TQuestVars, store?: StoreState) => string;
    getDescription: (questVars?: TQuestVars, store?: StoreState) => string;
    getOptions(questVars?: TQuestVars, store?: StoreState): Record<string, string>;
    // answer(option: string, questState, store); => {
}

// todo: no longer nullable questvars and store
