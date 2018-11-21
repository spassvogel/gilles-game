import { StoreState } from '../stores';
import { combineReducers } from 'redux';
import { structures } from './structures';
import { resources } from './resources';
import { equipment } from './equipment';

export default combineReducers<StoreState>({
    structures,
    resources,
    equipment,
}); 
