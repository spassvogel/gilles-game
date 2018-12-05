import { AdventurerStoreState } from "./adventurer";
import { EquipmentStoreState } from "./equipment";
import { ResourceStoreState } from "./resources";
import { StructuresStoreState } from "./structures";
import { TasksStoreState } from "./tasks";

export interface StoreState {
    randomseed: string;
    gold: number;
    workers: number;
    resources: ResourceStoreState;
    equipment: EquipmentStoreState;
    structures: StructuresStoreState;
    tasks: TasksStoreState;
    adventurers: AdventurerStoreState[];
}
