// tslint:disable:object-literal-sort-keys
import { AnyAction, Dispatch } from "redux";
import { advanceQuest, startEncounter, updateQuestVars } from "src/actions/quests";
import { Oracle } from "src/oracle";
import { StoreState } from "src/stores";
import { Encounter, EncounterDefinition } from "./types";

// tslint:disable-next-line:no-empty-interface
export interface QuestVars {
}

export const goblinHouseOutside: EncounterDefinition = {
    name: Encounter.goblinHouseOutside,
    getOracle: (questName: string, store: StoreState) => {
        return new Oracle(questName, store);
    },
    getTitle: (oracle: Oracle) => "As you make your way along the forest you notice a small house just of the road, smoke rises from the chimney",
    getDescription: (oracle: Oracle) => {
        return "";
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
    getTitle: (oracle: Oracle) => "The party stands inside the hallway.",
    getDescription: (oracle: Oracle) => {
        return "";
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
