import { Reducer } from "redux";
import { ResourceStoreState } from "store/types/resources";
import { Resource } from "definitions/resources";
import { Action } from "store/actions";


export const resources: Reducer<ResourceStoreState> = (state: ResourceStoreState = initialResourcesState, action: Action) => {

    const addResources = (resourcesToAdd: ResourceStoreState) => {
        // todo: Check if warehouse can hold it
        return Object.keys(state).reduce<ResourceStoreState>((acc, value) => {
            const resource = value as Resource;
            acc[resource] = (state[resource] ?? 0) + (resourcesToAdd[resource] || 0);
            return acc;
        }, {});
    };

    switch (action.type) {
        case "addResources": {
            const resourcesToAdd = action.resources;
            return addResources(resourcesToAdd);
        }
        case "removeResources": {
            const resourcesToRemove = action.resources;
            return Object.keys(state).reduce<ResourceStoreState>((acc, value) => {
                const resource = value as Resource;
                acc[resource] = (state[resource] ?? 0) - (resourcesToRemove[resource] || 0);
                return acc;
            }, {});
        }

        case "gameTick": {
            const resourcesToAdd = action.resources;
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