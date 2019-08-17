import { Structure } from "definitions/structures";
import { StructureState, StructureStoreState, initialState as structureInitialState } from "./structure";

export interface StructuresStoreState {
    [Structure.alchemist]: StructureStoreState;
    [Structure.armoursmith]: StructureStoreState;
    [Structure.garden]: StructureStoreState;
    [Structure.lumberMill]: StructureStoreState;
    [Structure.mine]: StructureStoreState;
    [Structure.quarry]: StructureStoreState;
    [Structure.tavern]: StructureStoreState;
    [Structure.tannery]: StructureStoreState;
    [Structure.warehouse]: StructureStoreState;
    [Structure.weaponsmith]: StructureStoreState;
    [Structure.weaver]: StructureStoreState;
    [Structure.workshop]: StructureStoreState;
}

export const initialState: StructuresStoreState = {
    [Structure.alchemist]: { level: 0, workers: 1, state: StructureState.NotBuilt  },
    [Structure.armoursmith]: structureInitialState,
    [Structure.garden]: { level: 0, workers: 0, state: StructureState.Built  }, // TODO: change back to NotBuilt
    [Structure.lumberMill]: structureInitialState,
    [Structure.mine]: { level: 0, workers: 0, state: StructureState.NotBuilt  },
    [Structure.quarry]: structureInitialState,
    [Structure.tavern]: { level: 0, workers: 0, state: StructureState.Built },
    [Structure.tannery]: structureInitialState,
    [Structure.warehouse]: { level: 0, workers: 0, state: StructureState.Built},
    [Structure.weaponsmith]: { level: 0, workers: 0, state: StructureState.Built },
    [Structure.weaver]: structureInitialState,
    [Structure.workshop]: structureInitialState,
};
