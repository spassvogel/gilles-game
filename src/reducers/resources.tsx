import { Reducer, AnyAction } from 'redux';
import { ResourceStoreState, initialState } from '../stores/resources';
import { ActionType, AddResources } from '../actions/resources';

/**
 * reducer
 * @param state 
 * @param action 
 */
export const resources: Reducer<ResourceStoreState> = (state:ResourceStoreState = initialState, action: AnyAction) => {
    switch (action.type) {
        case ActionType.addResources:
	        const resourcesToAdd = (action as AddResources).resources;
			return addOrRemoveResources(resourcesToAdd, state, "+");

        case ActionType.removeResources:
	        const resourcesToRemove = (action as AddResources).resources;
			return addOrRemoveResources(resourcesToRemove, state, "-");

        // case EquipmentActionType.craft:     
        //     // todo: Maybe this can just be ActionType.removeResources?

        //     const cost = (action as CraftAction).productionDefinition.cost;
        //     const copy = { ...state };
        //     // Subtract the cost of the crafted equipment from resources
        //     Object.keys(cost).forEach(resource => copy[resource] -= cost[resource]); 
        //     return copy;
    } 
    return state;
}

const addOrRemoveResources = (resources:ResourceStoreState, state:ResourceStoreState, operator:string):ResourceStoreState => {
    return Object.keys(state).reduce((accumulator:object, current:string) => {
        if(operator == "-"){
			accumulator[current] = state[current] - (resources[current] || 0);
		} 
		else {
			accumulator[current] = state[current] + (resources[current] || 0);
		}
        return accumulator;
    }, {});

}