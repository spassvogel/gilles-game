export const bla = false;

// import { backstabbed } from "./backstabbed";
// import { goblinHouseHallway, goblinHouseOutside } from "./goblinHouse";
// import { theBigTree } from "./theBigTree";
// import { EncounterDefinition } from "./types";

const all = {
    // backstabbed,
    // goblinHouseHallway,
    // goblinHouseOutside,
    // theBigTree,
};

export default all;

export function getDefinition(encounter: string) {
    return all[encounter];
}
