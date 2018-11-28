import { Reducer, AnyAction } from 'redux';
import { ResourceStoreState, initialState } from '../stores/resources';
import { ActionType, AddResources } from '../actions';
import { ActionType as EquipmentActionType, Action as EquipmentAction, CraftAction } from '../actions/equipment';

/**
 * reducer
 * @param state 
 * @param action 
 */
export const resources: Reducer<ResourceStoreState> = (state:ResourceStoreState = initialState, action: AnyAction) => {
    switch (action.type) {
        case ActionType.addResources:
        const resourcesToAdd = (action as AddResources).resources;
        const result = Object.keys(state).reduce((accumulator:object, current:string) => {
            accumulator[current] = state[current] + (resourcesToAdd[current] || 0);
            return accumulator;
        }, {});
        console.log(result)

        return result;

        case EquipmentActionType.craft:     
            // todo: Maybe this can just be ActionType.removeResources?

            const cost = (action as CraftAction).productionDefinition.cost;
            const copy = { ...state };
            // Subtract the cost of the crafted equipment from resources
            Object.keys(cost).forEach(resource => copy[resource] -= cost[resource]); 
            return copy;
    } 
    return state;
}