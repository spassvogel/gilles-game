import { Structure } from "src/definitions/structures";
import { StructureStoreState } from "./structure";

export interface StructuresStoreState {
    [Structure.alchemist]: StructureStoreState,
    [Structure.armoursmith]: StructureStoreState,
    [Structure.garden]: StructureStoreState,
    [Structure.lumberMill]: StructureStoreState,
    [Structure.mine]: StructureStoreState,
    [Structure.quarry]: StructureStoreState,
    [Structure.tavern]: StructureStoreState,
    [Structure.tannery]: StructureStoreState,
    [Structure.warehouse]: StructureStoreState,
    [Structure.weaponsmith]: StructureStoreState,
    [Structure.weaver]: StructureStoreState,
}

export const initialState: StructuresStoreState = {
    [Structure.alchemist]: { level: 0, workers: 1 },
    [Structure.armoursmith]: { level: 0, workers: 0 },
    [Structure.garden]: { level: 0, workers: 0 },
    [Structure.lumberMill]: { level: 0, workers: 0 },
    [Structure.mine]: { level: 0, workers: 0 },
    [Structure.quarry]: { level: 0, workers: 0 },
    [Structure.tavern]: { level: 0, workers: 0 },
    [Structure.tannery]: { level: 0, workers: 0 },
    [Structure.warehouse]: { level: 0, workers: 0 },
    [Structure.weaponsmith]: { level: 0, workers: 0 },
    [Structure.weaver]: { level: 0, workers: 0 },
};
