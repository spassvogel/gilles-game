import { StructureStoreState } from './structure';

export interface StructuresStoreState {
    lumberMill: StructureStoreState,
    // ironMine: StructureStoreState,
    // forge: StructureStoreState,
    // blacksmith: StructureStoreState,
    // stables: StructureStoreState,
    // tannery: StructureStoreState,
    farm: StructureStoreState,
    // alchemist: StructureStoreState,
}
export const initialState:StructuresStoreState = {
    lumberMill: { 
        level: 0,
        workers: 0
    },
    farm: { 
        level: 0,
        workers: 0
    }
}