import { combineReducers } from "redux";
import { StoreState } from "../stores";
import { activeQuests } from "./activeQuests";
import { adventurers } from "./adventurers";    // tmp
import { engine } from "./engine";
import { gold } from "./gold";
import { items } from "./items";
import { log } from "./log";
import { parties } from "./parties";
import { resources } from "./resources";
import { rngState } from "./rngState";
import { structures } from "./structures";
import { tasks } from "./tasks";
// import { version } from "./version";
import { workers } from "./workers";

export default combineReducers<StoreState>({
    activeQuests,
    adventurers,
    availableQuests: activeQuests,
    engine,
    gold,
    items,
    log,
    parties,
    resources,
    rngState,
    structures,
    tasks,
    // version,
    workers,
});
