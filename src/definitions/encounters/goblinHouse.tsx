// tslint:disable:object-literal-sort-keys
import { AnyAction, Dispatch } from "redux";
import { addGold } from "src/actions/gold";
import { updateQuestVars, startEncounter } from "src/actions/quests";
import { Oracle } from "src/oracle";
import { StoreState } from "src/stores";
import { randomInt } from "src/utils/random";
import { EncounterDefinition, Encounter } from "./types";

export interface QuestVars {
}

export const goblinHouseOutside: EncounterDefinition = {
    name: Encounter.goblinHouseOutside,
    getOracle: (questName: string, store: StoreState) => {
        return new Oracle(questName, store);
    },
    getTitle: (oracle: Oracle) => "The party stands outside a house",
    getDescription: (oracle: Oracle) => {
        return "";
    },
    getOptions: (oracle: Oracle) => {
        const options: Record<string, string> = {
            goInside: "Go inside the house",
            leave: "Leave the premise",
        };
        return options;
    },
    answer: (option: string, oracle: Oracle, dispatch: Dispatch<AnyAction>) => {
        const { store, questVars, quest } = oracle;
        switch (option) {
            case "walkAround":
                return "Your party walks around the tree";

            case "goInside":
                const nextEncounter = startEncounter(quest.name, Encounter.goblinHouseHallway);
                //const action = updateQuestVars(quest.name, questVars);
                dispatch(nextEncounter);

                const goldAmount = randomInt(2, 5);
                const goldAction = addGold(goldAmount);
                dispatch(goldAction);

                // tslint:disable-next-line:max-line-length
                return `The party coutiously opens the door and goes inside`;
            default:
                throw new Error(`Unhandled option ${option}`);
        }
    },
};

export const goblinHouseHallway: EncounterDefinition = {
    name: Encounter.goblinHouseHallway,
    getOracle: (questName: string, store: StoreState) => {
        return new Oracle(questName, store);
    },
    getTitle: (oracle: Oracle) => "The party stands inside the hallway.",
    getDescription: (oracle: Oracle) => {
        return "";
    },
    getOptions: (oracle: Oracle) => {
        const options: Record<string, string> = {
            goInside: "Go inside the house",
            leave: "Leave the premise",
        };
        return options;
    },
    answer: (option: string, oracle: Oracle, dispatch: Dispatch<AnyAction>) => {
        const { store, questVars, quest } = oracle;
        switch (option) {
            case "walkAround":
                return "Your party walks around the tree";

            case "goInside":
                //const nextEncounter = startEncounter(quest.name, goblinhouseInside)
                const action = updateQuestVars(quest.name, questVars);
                dispatch(action);

                const goldAmount = randomInt(2, 5);
                const goldAction = addGold(goldAmount);
                dispatch(goldAction);

                // tslint:disable-next-line:max-line-length
                return `d lifts the heavy tree, moving it aside. Underneath your party finds ${goldAmount} gold coins`;
            default:
                throw new Error(`Unhandled option ${option}`);
        }
    },
};


// todo: other goblinHouse encounters