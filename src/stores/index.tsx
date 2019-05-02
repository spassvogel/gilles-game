import { State as seedrandomStateType } from "seedrandom";
import { Item } from "src/definitions/items/types";
import { AdventurerStoreState } from "./adventurer";
import { EngineStoreState } from "./engine";
import { LogEntry } from "./logEntry";
import { PartyStoreState } from "./party";
import { QuestStoreState } from "./quest";
import { ResourceStoreState } from "./resources";
import { StructuresStoreState } from "./structures";
import { TasksStoreState } from "./tasks";

export interface StoreState {
    adventurers: AdventurerStoreState[];
    engine: EngineStoreState;
    gold: number;
    items: Array<null|Item>;    // items in warehouse
    log: LogEntry[];
    parties: Record<string, PartyStoreState>;
    quests: QuestStoreState[];
    workers: number;
    resources: ResourceStoreState;
    rngState: seedrandomStateType;
    structures: StructuresStoreState;
    tasks: TasksStoreState;
}
