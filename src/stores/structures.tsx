import { StructureStoreState } from './structure';
import weaponsmith from 'src/definitions/structures/weaponsmith';
import armoursmith from 'src/definitions/structures/armoursmith';

export interface StructuresStoreState {
    lumberMill: StructureStoreState,
    ironMine: StructureStoreState,
    // forge: StructureStoreState,
    weaponsmith: StructureStoreState,
    armoursmith: StructureStoreState,
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
    ironMine: { 
        level: 0,
        workers: 0
    },
    farm: { 
        level: 0,
        workers: 1
    },
    tannery: { 
        level: 0,
        workers: 1
    },
    weaponsmith: { 
        level: 0,
        workers: 1
    },
    armoursmith: { 
        level: 0,
        workers: 1
    }
}