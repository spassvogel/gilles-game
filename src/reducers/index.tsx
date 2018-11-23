import { StoreState } from '../stores';
import { combineReducers } from 'redux';
import { structures } from './structures';
import { gold } from './gold';
import { resources } from './resources';
import { equipment } from './equipment';

export default combineReducers<StoreState>({
    gold,
    structures,
    resources,
    equipment,
}); 
