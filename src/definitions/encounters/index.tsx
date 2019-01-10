import { backstabbed } from "./backstabbed";
import { theBigTree } from "./theBigTree";
import { EncounterDefinition } from "./types";

export interface Encounters {
    backstabbed: EncounterDefinition<any>;
    theBigTree: EncounterDefinition<any>;
}

const encounters: Encounters = {
    backstabbed,
    theBigTree,
};

export default encounters;
