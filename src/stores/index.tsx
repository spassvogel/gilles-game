import { seedrandomStateType } from "seedrandom";
import { AdventurerStoreState } from "./adventurer";
import { EquipmentStoreState } from "./equipment";
import { QuestStoreState } from "./quest";
import { ResourceStoreState } from "./resources";
import { StructuresStoreState } from "./structures";
import { TasksStoreState } from "./tasks";

export interface StoreState {
    gold: number;
    workers: number;
    resources: ResourceStoreState;
    equipment: EquipmentStoreState;
    activeQuests: QuestStoreState[];
    availableQuests: QuestStoreState[];
    rngState: seedrandomStateType;
    structures: StructuresStoreState;
    tasks: TasksStoreState;
    adventurers: AdventurerStoreState[];
}
