// tslint:disable:object-literal-sort-keys
import { AnyAction, Dispatch } from "redux";
import { addItemToInventory } from "src/actions/adventurers";
import { Oracle } from "src/oracle";
import { StoreState } from "src/stores";
import { Item } from "../items/types";
import { EncounterDefinition, Encounter } from "./types";

// tslint:disable-next-line:no-empty-interface
export interface QuestVars {
}

export const backstabbed: EncounterDefinition = {
    name: Encounter.backstabbed,
    getOracle: (questName: string, store: StoreState) => {
        return new Oracle(questName, store);
    },
    getTitle: (oracle: Oracle) => "Backstabbed",
    getDescription: (oracle: Oracle) => {
        return "A group of rogues emerges from the bushes, knives drawn.";
    },
    getOptions: (oracle: Oracle) => {
        const options: Record<string, string> = {
            fight: "Fight the brigands",
            flight: "Run away!",
        };
        return options;
    },
    answer: (option: string, oracle: Oracle, dispatch: Dispatch<AnyAction>) => {
        switch (option) {
            case "flight":
                return "You run away like a pussy";
            case "fight":
                const finder = oracle.getRandomAdventurer();
                dispatch(addItemToInventory(finder.id, Item.deedForWeaponsmith));
                return `The party fights off the rogues. One of them drops a document. ${finder.name} picks it up`;
            default:
                throw new Error(`Unhandled option '${option}`);
        }
    },
};
