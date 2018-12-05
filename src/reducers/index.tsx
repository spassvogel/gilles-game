import { combineReducers } from "redux";
import { StoreState } from "../stores";
import { adventurers } from "./adventurers";    // tmp
import { equipment } from "./equipment";
import { gold } from "./gold";
import { resources } from "./resources";
import { rngState } from "./rngState";
import { structures } from "./structures";
import { tasks } from "./tasks";
import { workers } from "./workers";

export default combineReducers<StoreState>({
    adventurers,
    equipment,
    gold,
    resources,
    rngState,
    structures,
    tasks,
    workers,
});
