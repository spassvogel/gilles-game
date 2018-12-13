import { StoreState } from "src/stores";

export interface EncounterDefinition<TQuestState> {
    chance?: number;    // number from 0 to 1, undefined means: 1
    getTitle: (questState: TQuestState, store: StoreState) => string;
    getDescription: (questState: TQuestState, store: StoreState) => string;
    getOptions(questState: TQuestState, store: StoreState): Record<string, string>;
    //answer(option: string, questState, store); => {
}
