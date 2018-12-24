// tslint:disable:object-literal-sort-keys
import { StoreState } from "src/stores";
import { EncounterDefinition } from "./types";

export interface QuestVars {
}

export const backstabbed: EncounterDefinition<QuestVars> = {
    getTitle: (questVars: QuestVars, store: StoreState) => "Backstabbed",
    getDescription: (questVars: QuestVars, store: StoreState) => {
        return "A group of rogues emerges from the bushes, knives drawn.";
    },
    getOptions: (questVars: QuestVars, store: StoreState) => {
        const options: Record<string, string> = {
            fight: "Fight the brigands",
            flight: "Run away!",
        };
        return options;
    },
    answer: (option: string, questVars: QuestVars, store: StoreState) => {
        return "NOT IMPLEMENTED";
    }
};
