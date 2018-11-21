import { Reducer } from 'redux';
import { ResourceStoreState, initialState } from '../stores/resources';
import { INCREMENT_RESOURCE } from '../constants/index';
import { IncrementResource } from '../actions';


/**
 * reducer
 * @param state 
 * @param action 
 */
export const resources : Reducer<ResourceStoreState> = (state:ResourceStoreState = initialState, action: IncrementResource) => {
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