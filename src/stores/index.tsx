import { State as seedrandomStateType } from "seedrandom";
import { Item } from "src/definitions/items/types";
import { AdventurerStoreState } from "./adventurer";
import { EngineStoreState } from "./engine";
import { PartyStoreState } from "./party";
import { QuestStoreState } from "./quest";
import { ResourceStoreState } from "./resources";
import { StructuresStoreState } from "./structures";
import { TasksStoreState } from "./tasks";

export interface StoreState {
    gold: number;
    workers: number;
    resources: ResourceStoreState;
    engine: EngineStoreState;
    parties: Record<string, PartyStoreState>;
    activeQuests: QuestStoreState[];
    availableQuests: QuestStoreState[];
    rngState: seedrandomStateType;
    structures: StructuresStoreState;
    items: Array<null|Item>;    // items in warehouse
    tasks: TasksStoreState;
    adventurers: AdventurerStoreState[];
}
