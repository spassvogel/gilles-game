import { State as seedrandomStateType } from "seedrandom";
import { AdventurerStoreState } from "./adventurer";
import { EngineStoreState } from "./engine";
import { LogEntry } from "./logEntry";
import { QuestStoreState } from "./quest";
import { ResourceStoreState } from "./resources";
import { SettingsState } from "./settings";
import { StockpileStoreState } from "./stockpile";
import { StructuresStoreState } from "./structures";
import { TasksStoreState } from "./tasks";

export interface StoreState {
  adventurers: AdventurerStoreState[];
  engine: EngineStoreState;
  gold: number;
  stockpile: StockpileStoreState;  // items in warehouse
  log: LogEntry[];
  quests: QuestStoreState[];
  workers: number;
  resources: ResourceStoreState;
  rngState: seedrandomStateType;
  settings: SettingsState;
  structures: StructuresStoreState;
  tasks: TasksStoreState;
}
