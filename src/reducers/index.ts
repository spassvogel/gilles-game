import { combineReducers } from "redux";
import { StoreState } from "../stores";
import { adventurers } from "./adventurers";
import { combat } from "./combat";
import { engine } from "./engine";
import { gold } from "./gold";
import { items } from "./items";
import { log } from "./log";
import { quests } from "./quests";
import { resources } from "./resources";
import { rngState } from "./rngState";
import { structures } from "./structures";
import { tasks } from "./tasks";
import { workers } from "./workers";

export default combineReducers<StoreState>({
    adventurers,
    combat,
    engine,
    gold,
    stockpile: items,
    log,
    quests,
    resources,
    rngState,
    structures,
    tasks,
    workers,
});
