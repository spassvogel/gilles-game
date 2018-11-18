import { IncrementResource } from '../actions';
import { StoreState } from '../types/index';
import { INCREMENT_RESOURCE } from '../constants/index';
import { combineReducers } from 'redux';
import { weapons } from './weapons';
//import { Reducer } from 'redux';


export function resources(state: StoreState, action: IncrementResource): StoreState {
    console.log(action.type);
    switch (action.type) {
        case INCREMENT_RESOURCE:
            if(state[action.resource] === undefined) return state;

            return { 
                ...state, 
                [action.resource]: state[action.resource] + 1
            };    
    } 
  return state;
}

export default combineReducers<StoreState>({
    weapons: weapons
}); 
