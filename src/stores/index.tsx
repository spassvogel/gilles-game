import { StructuresStoreState } from './structures';
import { ResourceStoreState } from './resources';
import { EquipmentStoreState } from './equipment';
import { TasksStoreState } from './tasks';
import { AdventurerStoreState } from './adventurer';

export interface StoreState {
    randomseed: string,
    gold: number,
    workers: number,
    resources: ResourceStoreState,
    equipment: EquipmentStoreState,
    structures: StructuresStoreState,
    tasks: TasksStoreState
    adventurers: AdventurerStoreState[]
}
