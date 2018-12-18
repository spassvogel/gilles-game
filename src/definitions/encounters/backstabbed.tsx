// tslint:disable:object-literal-sort-keys
import { StoreState } from "src/stores";
import { EncounterDefinition } from "./types";

export interface QuestState {
}

export const backstabbed: EncounterDefinition<QuestState> = {
    getTitle: (questState: QuestState, store: StoreState) => "Backstabbed",
    getDescription: (questState: QuestState, store: StoreState) => {
        return "A group of rogues emerges from the bushes, knives drawn.";
    },
    getOptions: (questState: QuestState, store: StoreState) => {
        const options: Record<string, string> = {
            fight: "Fight the brigands",
            flight: "Run away!",
        };
        return options;
    },
};
