import { IncrementStructure } from '../actions';
import { StoreState } from '../stores';
import { INCREMENT_RESOURCE } from '../constants/index';
import { combineReducers } from 'redux';
import { structures } from './structures';
import { resources } from './resources';
import { equipment } from './equipment';

export default combineReducers<StoreState>({
    structures,
    resources,
    equipment,
}); 
