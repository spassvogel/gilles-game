import { Reducer } from 'redux';
import { ResourceStoreState, initialState } from '../stores/resources';
import { AddResource, ActionType } from '../actions';

/**
 * reducer
 * @param state 
 * @param action 
 */
export const resources: Reducer<ResourceStoreState> = (state:ResourceStoreState = initialState, action: AddResource) => {
    switch (action.type) {
        case ActionType.addResource:
            if(state[action.resource] === undefined) return state;

            return { 
                ...state,                    
                [action.resource]: state[action.resource] + action.value
            };
    } 
    return state;
}