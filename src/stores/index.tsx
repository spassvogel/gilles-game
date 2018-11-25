import { StructuresStoreState } from './structures';
import { ResourceStoreState } from './resources';
import { EquipmentStoreState } from './equipment';

export interface StoreState {
    randomseed: string,
    gold: number,
    workers: number,
    resources: ResourceStoreState,
    equipment: EquipmentStoreState,
    structures: StructuresStoreState
}
