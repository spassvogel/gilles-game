import { Structure } from "definitions/structures";
import { StructureState, StructureStoreState, initialState as structureInitialState, ProductionStructureStoreState } from "./structure";

export interface StructuresStoreState {
    [Structure.alchemist]: ProductionStructureStoreState;
    [Structure.armoursmith]: ProductionStructureStoreState;
    [Structure.garden]: StructureStoreState;
    [Structure.lumberMill]: StructureStoreState;
    [Structure.mine]: StructureStoreState;
    [Structure.quarry]: StructureStoreState;
    [Structure.tavern]: StructureStoreState;
    [Structure.tannery]: StructureStoreState;
    [Structure.warehouse]: StructureStoreState;
    [Structure.weaponsmith]: ProductionStructureStoreState;
    [Structure.weaver]: StructureStoreState;
    [Structure.workshop]: StructureStoreState;
}

export const initialState: StructuresStoreState = {
    [Structure.alchemist]:  { ...structureInitialState, produces: [] },
    [Structure.armoursmith]: { ...structureInitialState, produces: [] },
    [Structure.garden]: { level: 0, workers: 0, state: StructureState.Built  }, // TODO: change back to NotBuilt
    [Structure.lumberMill]: structureInitialState,
    [Structure.mine]: { level: 0, workers: 0, state: StructureState.NotBuilt  },
    [Structure.quarry]: structureInitialState,
    [Structure.tavern]: { level: 0, workers: 0, state: StructureState.Built },
    [Structure.tannery]: structureInitialState,
    [Structure.warehouse]: { level: 0, workers: 0, state: StructureState.Built},
    [Structure.weaponsmith]:  { ...structureInitialState, produces: [] },
    [Structure.weaver]: structureInitialState,
    [Structure.workshop]: structureInitialState,
};
