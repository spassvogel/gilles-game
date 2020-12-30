import { ActionType as GameActionType, GameTickAction } from "store/actions/game";
import { AnyAction, Reducer } from "redux";
import { ActionType, AddResources } from "store/actions/resources";
import { ResourceStoreState } from "store/types/resources";

/**
 * reducer
 * @param state
 * @param action
 */
export const resources: Reducer<ResourceStoreState> = (state: ResourceStoreState = initialResourcesState,
                                                       action: AnyAction | GameTickAction) => {

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
            if (resourcesToAdd === null) {
                return state;
            }
            return addResources(resourcesToAdd);
        }
    }
    return state;
};

export const initialResourcesState: ResourceStoreState = {
    fabric: 0,
    food: 0,
    iron: 10,
    leather: 0,
    stone: 0,
    wood: 10,
};