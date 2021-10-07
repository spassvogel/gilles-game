import { combineReducers } from "redux";
import { StoreState } from "store/types"
import { adventurers, initialAdventurers } from "./adventurers";
import { engine, getInitialEngineState } from "./engine";
import { gold, initialGoldState } from "./gold";
import { getInitialStockpile, stockpile } from "./stockpile";
import { initialLogState, log } from "./log";
import { initialQuestState, quests } from "./quests";
import { initialResourcesState, resources } from "./resources";
import { initialRngState, rngState } from "./rngState";
import { initialSettingsState, settings } from "./settings";
import { initialStructuresState, structures } from "./structures";
import { initialTasksState, tasks } from "./tasks";
import { initialWorkersState, workers } from "./workers";

export default combineReducers<StoreState>({
  adventurers,
  engine,
  gold,
  stockpile,
  log,
  quests,
  resources,
  rngState,
  settings,
  structures,
  tasks,
  workers,
});

export const createInitialStore = () => ({
  adventurers: initialAdventurers,
  engine: getInitialEngineState(),
  gold: initialGoldState,
  stockpile: getInitialStockpile(),
  log: initialLogState,
  quests: initialQuestState,
  resources: initialResourcesState,
  rngState: initialRngState,
  settings: initialSettingsState,
  structures: initialStructuresState,
  tasks: initialTasksState,
  workers: initialWorkersState
})
