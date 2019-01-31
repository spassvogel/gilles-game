import { AnyAction, Dispatch } from "redux";
import { Oracle } from "src/oracle";
import { StoreState } from "src/stores";

export interface EncounterDefinition {
    name: Encounter,
    getOracle: (questName: string, store: StoreState) => Oracle;
    chance?: number;    // number from 0 to 1, undefined means: 1
    getTitle: (oracle: Oracle) => string;
    getDescription: (oracle: Oracle) => string;
    getOptions: (oracle: Oracle) => Record<string, string>;
    answer: (option: string, oracle: Oracle, dispatch: Dispatch<AnyAction>) => string;
}


export enum Encounter {
    backstabbed = "backstabbed",
    goblinHouseHallway = "goblinHouseHallway",
    goblinHouseOutside = "goblinHouseOutside",
    theBigTree = "theBigTree",
}