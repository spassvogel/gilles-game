import { combineReducers } from "redux";
import { StoreState } from "../stores";
import { adventurers } from "./adventurers";
import { engine } from "./engine";
import { gold } from "./gold";
import { items } from "./items";
import { log } from "./log";
import { parties } from "./parties";
import { quests } from "./quests";
import { resources } from "./resources";
import { rngState } from "./rngState";
import { structures } from "./structures";
import { tasks } from "./tasks";
// import { version } from "./version";
import { workers } from "./workers";

export default combineReducers<StoreState>({
    adventurers,
    engine,
    gold,
    items,
    log,
    parties,
    quests,
    resources,
    rngState,
    structures,
    tasks,
    // version,
    workers,
});
