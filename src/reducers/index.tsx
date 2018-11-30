import { StoreState } from '../stores';
import { combineReducers } from 'redux';
import { structures } from './structures';
import { randomseed } from './randomseed';
import { gold } from './gold';
import { workers } from './workers';
import { resources } from './resources';
import { equipment } from './equipment';
import { tasks } from './tasks';
import { adventurers } from './adventurers';    // tmp

export default combineReducers<StoreState>({
    randomseed,
    gold,
    workers,
    structures,
    resources,
    equipment,
    tasks,
    adventurers
}); 
