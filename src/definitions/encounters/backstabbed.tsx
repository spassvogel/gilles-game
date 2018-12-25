// tslint:disable:object-literal-sort-keys
import { Oracle } from "src/oracle";
import { StoreState } from "src/stores";
import { EncounterDefinition } from "./types";

// tslint:disable-next-line:no-empty-interface
export interface QuestVars {
}

export const backstabbed: EncounterDefinition<QuestVars> = {
    getOracle: (questName: string, store: StoreState) => {
        return new Oracle<QuestVars>(questName, store);
    },
    getTitle: (oracle: Oracle<QuestVars>) => "Backstabbed",
    getDescription: (oracle: Oracle<QuestVars>) => {
        return "A group of rogues emerges from the bushes, knives drawn.";
    },
    getOptions: (oracle: Oracle<QuestVars>) => {
        const options: Record<string, string> = {
            fight: "Fight the brigands",
            flight: "Run away!",
        };
        return options;
    },
    answer: (option: string, oracle: Oracle<QuestVars>) => {
        return "NOT IMPLEMENTED";
    },
};
