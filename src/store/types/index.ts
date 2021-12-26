import { State as seedrandomStateType } from "seedrandom";
import { AdventurerStoreState } from "./adventurer";
import { EngineStoreState } from "./engine";
import { GameStoreState } from "./game";
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
  game: GameStoreState;
  gold: number;
  log: LogEntry[];
  stockpile: StockpileStoreState;  // items in warehouse
  resources: ResourceStoreState;
  rngState: seedrandomStateType;
  settings: SettingsState;
  structures: StructuresStoreState;
  tasks: TasksStoreState;
  quests: QuestStoreState[];
  workers: number;
}
