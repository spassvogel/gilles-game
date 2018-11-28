import { StructuresStoreState } from './structures';
import { ResourceStoreState } from './resources';
import { EquipmentStoreState } from './equipment';
import { TaskStoreState } from './taskStoreState';

export interface StoreState {
    randomseed: string,
    gold: number,
    workers: number,
    resources: ResourceStoreState,
    equipment: EquipmentStoreState,
    structures: StructuresStoreState,
    scheduledTasks: TaskStoreState[]
}
