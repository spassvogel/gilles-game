
import { ActionType as GameActionType, GameTickAction } from "actions/game";
import { AnyAction, Reducer } from "redux";
import { ActionType, AddResources } from "../actions/resources";
import { initialState, ResourceStoreState } from "../stores/resources";

/**
 * reducer
 * @param state
 * @param action
 */
export const resources: Reducer<ResourceStoreState> = (state: ResourceStoreState = initialState,
                                                       action: AnyAction| GameTickAction) => {

    const addResources = (resourcesToAdd: ResourceStoreState) => {
        // todo: Check if warehouse can hold it
        return Object.keys(state).reduce((accumulator: object, current: string) => {
            accumulator[current] = state[current] + (resourcesToAdd[current] || 0);
            return accumulator;
        }, {});
    };

    switch (action.type) {
        case ActionType.addResources: {
            const resourcesToAdd = (action as AddResources).resources;
            return addResources(resourcesToAdd);
        }
        case ActionType.removeResources: {
            const resourcesToRemove = (action as AddResources).resources;
            return Object.keys(state).reduce((accumulator: object, current: string) => {
                accumulator[current] = state[current] - (resourcesToRemove[current] || 0);
                return accumulator;
            }, {});
        }

        case GameActionType.gameTick: {
            const resourcesToAdd = (action as GameTickAction).resources;
            return addResources(resourcesToAdd);
        }
    }
    return state;
};
