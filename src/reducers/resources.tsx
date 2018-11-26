import { Reducer, AnyAction } from 'redux';
import { ResourceStoreState, initialState } from '../stores/resources';
import { ActionType } from '../actions';
import { ActionType as EquipmentActionType, Action as EquipmentAction } from '../actions/equipment';

/**
 * reducer
 * @param state 
 * @param action 
 */
export const resources: Reducer<ResourceStoreState> = (state:ResourceStoreState = initialState, action: AnyAction) => {
    switch (action.type) {
        case ActionType.addResource:
            if(state[action.resource] === undefined) return state;

            return { 
                ...state,                    
                [action.resource]: state[action.resource] + action.value
            };

        case EquipmentActionType.craft:            
            const cost = (action as EquipmentAction).productionDefinition.cost;
            const copy = { ...state };
            // Subtract the cost of the crafted equipment from resources
            Object.keys(cost).forEach(resource => copy[resource] -= cost[resource]); 
            return copy;
    } 
    return state;
}