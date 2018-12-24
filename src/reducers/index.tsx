import { combineReducers } from "redux";
import { StoreState } from "../stores";
import { activeQuests } from "./activeQuests";
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
    activeQuests,
    availableQuests: activeQuests,
    resources,
    rngState,
    structures,
    tasks,
    workers,
});
