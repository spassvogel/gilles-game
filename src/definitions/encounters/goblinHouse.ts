// tslint:disable:object-literal-sort-keys
import { advanceQuest, startEncounter, updateQuestVars } from "actions/quests";
import { Oracle } from "oracle";
import { AnyAction, Dispatch } from "redux";
import { StoreState } from "stores";
import { Encounter, EncounterDefinition } from "./types";

// tslint:disable-next-line:no-empty-interface
export interface QuestVars {
}

export const goblinHouseOutside: EncounterDefinition = {
    name: Encounter.goblinHouseOutside,
    getOracle: (questName: string, store: StoreState) => {
        return new Oracle(questName, store);
    },
    getDescription: (oracle: Oracle) => {
        return { key: "encounter-goblinHouseOutside-description" };
    },
    getOptions: (oracle: Oracle) => {
        const options: Record<string, string> = {
            investigate: "Investigate",
            leave: "Keep walking",
        };
        return options;
    },
    answer: (option: string, oracle: Oracle, dispatch: Dispatch<AnyAction>) => {
        const { store, questVars, quest } = oracle;
        switch (option) {
            case "investigate":
                const nextEncounter = startEncounter(quest.name, Encounter.goblinHouseHallway);
                // const action = updateQuestVars(quest.name, questVars);
                dispatch(nextEncounter);

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
    getDescription: (oracle: Oracle) => {
        return { key: "encounter-goblinHouseHallway-description" };
    },
    getOptions: (oracle: Oracle) => {
        const options: Record<string, string> = {
            investigate: "Go inside the house",
            leave: "Leave the premise",
        };
        return options;
    },
    answer: (option: string, oracle: Oracle, dispatch: Dispatch<AnyAction>) => {
        const { store, questVars, quest } = oracle;
        switch (option) {
            case "walkAround":
                return "Your party walks around the tree";

            case "leave":
                // const nextEncounter = startEncounter(quest.name, goblinhouseInside)
                const action = advanceQuest(oracle.questName);
                dispatch(action);

                // tslint:disable-next-line:max-line-length
                return `The party escapes the house unscathed`;
            default:
                throw new Error(`Unhandled option ${option}`);
        }
    },
};

// todo: other goblinHouse encounters
