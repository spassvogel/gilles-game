// tslint:disable:object-literal-sort-keys
import { Oracle } from "src/oracle";
import { StoreState } from "src/stores";
import { EncounterDefinition } from "./types";
import { AnyAction, Dispatch } from "redux";
import { addEquipment } from "src/actions/equipment";
import { Item } from "../items/types";
import { adventurerPicksUpItem } from "src/actions/adventurers";

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
    answer: (option: string, oracle: Oracle<QuestVars>, dispatch: Dispatch<AnyAction>) => {
        switch (option) {
            case "flight":
                return "You run away like a pussy";
            case "fight":
                const finder = oracle.getRandomAdventurer();
                dispatch(adventurerPicksUpItem(finder.id, Item.deedForWeaponsmith));
                return `The party fights off the rogues. One of them drops a document. ${finder.name} picks it up`;
            default:
                throw new Error(`Unhandled option '${option}`);
        }
    },
};
