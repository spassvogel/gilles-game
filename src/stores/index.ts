import { Item } from "definitions/items/types";
import { State as seedrandomStateType } from "seedrandom";
import { AdventurerStoreState } from "./adventurer";
import { CombatStoreState } from "./combat";
import { EngineStoreState } from "./engine";
import { LogEntry } from "./logEntry";
import { QuestStoreState } from "./quest";
import { ResourceStoreState } from "./resources";
import { StructuresStoreState } from "./structures";
import { TasksStoreState } from "./tasks";

export interface StoreState {
    adventurers: AdventurerStoreState[];
    combat: CombatStoreState;   // todo: deprecate?
    engine: EngineStoreState;
    gold: number;
    stockpile: Array<null|Item>;    // items in warehouse
    log: LogEntry[];
    quests: QuestStoreState[];
    workers: number;
    resources: ResourceStoreState;
    rngState: seedrandomStateType;
    structures: StructuresStoreState;
    tasks: TasksStoreState;
}
