import { Structure } from "src/definitions/structures";
import { StructureState, StructureStoreState } from "./structure";

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
}

export const initialState: StructuresStoreState = {
    [Structure.alchemist]: { level: 0, workers: 1, state: StructureState.NotBuilt  },
    [Structure.armoursmith]: { level: 0, workers: 0 , state: StructureState.NotBuilt },
    [Structure.garden]: { level: 0, workers: 0, state: StructureState.Built  }, // TODO: change back to NotBuilt
    [Structure.lumberMill]: { level: 0, workers: 0 , state: StructureState.NotBuilt },
    [Structure.mine]: { level: 0, workers: 0, state: StructureState.NotBuilt  },
    [Structure.quarry]: { level: 0, workers: 0 , state: StructureState.NotBuilt },
    [Structure.tavern]: { level: 0, workers: 0, state: StructureState.Built },
    [Structure.tannery]: { level: 0, workers: 0 , state: StructureState.NotBuilt },
    [Structure.warehouse]: { level: 0, workers: 0, state: StructureState.Built},
    [Structure.weaponsmith]: { level: 0, workers: 0, state: StructureState.Built },
    [Structure.weaver]: { level: 0, workers: 0, state: StructureState.NotBuilt },
};
