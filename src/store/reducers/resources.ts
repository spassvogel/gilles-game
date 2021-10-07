import { Reducer } from "redux";
import { ResourceStoreState } from "store/types/resources";
import { Resource } from "definitions/resources";
import { ResourcesAction } from "store/actions/resources";
import { GameAction } from "store/actions/game";

export const resources: Reducer<ResourceStoreState, ResourcesAction | GameAction> = (state = initialResourcesState, action) => {

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
