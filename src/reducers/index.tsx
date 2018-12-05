import { combineReducers } from "redux";
import { StoreState } from "../stores";
import { adventurers } from "./adventurers";    // tmp
import { equipment } from "./equipment";
import { gold } from "./gold";
import { randomseed } from "./randomseed";
import { resources } from "./resources";
import { structures } from "./structures";
import { tasks } from "./tasks";
import { workers } from "./workers";

export default combineReducers<StoreState>({
    adventurers,
    equipment,
    gold,
    randomseed,
    resources,
    structures,
    tasks,
    workers,
});
