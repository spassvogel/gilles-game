
import { AnyAction, Reducer } from "redux";
import { ActionType, AddResources } from "../actions/resources";
import { initialState, ResourceStoreState } from "../stores/resources";

/**
 * reducer
 * @param state
 * @param action
 */
export const resources: Reducer<ResourceStoreState> = (state: ResourceStoreState = initialState, action: AnyAction) => {
    switch (action.type) {
        case ActionType.addResources:
            const resourcesToAdd = (action as AddResources).resources;
            return Object.keys(state).reduce((accumulator: object, current: string) => {
                accumulator[current] = state[current] + (resourcesToAdd[current] || 0);
                return accumulator;
            }, {});

        case ActionType.removeResources:
            const resourcesToRemove = (action as AddResources).resources;
            return Object.keys(state).reduce((accumulator: object, current: string) => {
                accumulator[current] = state[current] - (resourcesToRemove[current] || 0);
                return accumulator;
            }, {});

        // case EquipmentActionType.craft:
        //     // todo: Maybe this can just be ActionType.removeResources?

        //     const cost = (action as CraftAction).productionDefinition.cost;
        //     const copy = { ...state };
        //     // Subtract the cost of the crafted equipment from resources
        //     Object.keys(cost).forEach(resource => copy[resource] -= cost[resource]);
        //     return copy;
    }
    return state;
};
