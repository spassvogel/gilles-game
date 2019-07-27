import { TextEntry } from "constants/text";
import { Oracle } from "oracle";
import { AnyAction, Dispatch } from "redux";
import { StoreState } from "stores";

export interface EncounterDefinition {
    name: Encounter;
    getOracle: (questName: string, store: StoreState) => Oracle;
    chance?: number;    // number from 0 to 1, undefined means: 1
    getDescription: (oracle: Oracle) => TextEntry;
    getOptions: (oracle: Oracle) => Record<string, string>;
    answer: (option: string, oracle: Oracle, dispatch: Dispatch<AnyAction>) => string;
}

export enum Encounter {
    backstabbed = "backstabbed",
    goblinHouseHallway = "goblinHouseHallway",
    goblinHouseOutside = "goblinHouseOutside",
    theBigTree = "theBigTree",
}
