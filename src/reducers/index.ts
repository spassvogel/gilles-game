import { Item } from "definitions/items/types";
import { combineReducers } from "redux";

import { ResourceStoreState } from "stores/resources";
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

// todo: not sure where to place this actually
export interface CostStoreState {
    gold?: number;
    time?: number;
    resources?: ResourceStoreState;
    materials?: Item[];
}

export default combineReducers<StoreState>({
    adventurers,
    combat,
    engine,
    gold,
    items,
    log,
    quests,
    resources,
    rngState,
    structures,
    tasks,
    // version,
    workers,
});
