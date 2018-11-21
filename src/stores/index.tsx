import { StructuresStoreState } from './structures';
import { ResourceStoreState } from './resources';
import { EquipmentStoreState } from './equipment';

export interface StoreState {
    resources: ResourceStoreState,
    equipment: EquipmentStoreState,
    structures: StructuresStoreState
}


export const Weapons = {
    CROSSBOWS: 'crossbows',
    LONGBOWS: 'longbows',
    SWORDS: 'swords',
    DAGGERS: 'daggers',
};