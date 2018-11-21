import { Reducer } from 'redux';
import { ResourceStoreState, initialState } from '../stores/resources';
import { ADD_RESOURCE } from '../constants/index';
import { AddResource } from '../actions';


/**
 * reducer
 * @param state 
 * @param action 
 */
export const resources : Reducer<ResourceStoreState> = (state:ResourceStoreState = initialState, action: AddResource) => {
    switch (action.type) {
        case ADD_RESOURCE:
            if(state[action.resource] === undefined) return state;

            return { 
                ...state,                    
                [action.resource]: state[action.resource] + 1
            };                
    } 
    return state;
}