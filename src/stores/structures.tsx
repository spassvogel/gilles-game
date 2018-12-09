import weaponsmith from "src/definitions/structures/weaponsmith";
import { StructureStoreState } from "./structure";

export interface StructuresStoreState {
    lumberMill: StructureStoreState;
    ironMine: StructureStoreState;
    // forge: StructureStoreState,
    weaponsmith: StructureStoreState;
    armoursmith: StructureStoreState;
    // stables: StructureStoreState,
    tannery: StructureStoreState;
    farm: StructureStoreState;
    // alchemist: StructureStoreState,
    warehouse: StructureStoreState;
}

export const initialState: StructuresStoreState = {
    armoursmith: {
        level: 0,
        workers: 1,
    },
    farm: {
        level: 0,
        workers: 1,
    },
    ironMine: {
        level: 0,
        workers: 0,
    },
    lumberMill: {
        level: 0,
        workers: 2,
    },
    tannery: {
        level: 0,
        workers: 1,
    },
    warehouse: {
        level: 1,
        workers: 1,
    },
    weaponsmith: {
        level: 0,
        workers: 1,
    },
};
