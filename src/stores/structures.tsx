import { StructureStoreState } from './structure';

export interface StructuresStoreState {
    lumberMill: StructureStoreState,
    // ironMine: StructureStoreState,
    // forge: StructureStoreState,
    // blacksmith: StructureStoreState,
    // stables: StructureStoreState,
    tannery: StructureStoreState,
    farm: StructureStoreState,
    // alchemist: StructureStoreState,
}
export const initialState:StructuresStoreState = {
    lumberMill: { 
        level: 0,
        workers: 2
    },
    farm: { 
        level: 0,
        workers: 1
    },
    tannery: { 
        level: 0,
        workers: 1
    }
}