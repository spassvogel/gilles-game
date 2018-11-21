import { StructuresStoreState } from './structures';
import { ResourceStoreState } from './resources';
import { EquipmentStoreState } from './equipment';

export interface StoreState {
    resources: ResourceStoreState,
    equipment: EquipmentStoreState,
    structures: StructuresStoreState
}
