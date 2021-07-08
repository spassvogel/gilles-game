import { Reducer } from "redux";
import { Structure } from "definitions/structures";
import { ProductionStructureStoreState, StructureState, StructureStoreState } from "store/types/structure";
import { isProductionStructure, StructuresStoreState } from "store/types/structures";
import { Action } from "store/actions";

/**
 * reducer
 * @param state
 * @param action
 */
export const structures: Reducer<StructuresStoreState, Action> = (state: StructuresStoreState = initialStructuresState, action: Action) => {
    switch (action.type) {
        case "startBuildingStructure": {
            return updateStructureState(state, action.structure, StructureState.Building);
        }
        case "finishBuildingStructure": {
            return updateStructureState(state, action.structure, StructureState.Built);
        }
        case "upgradeStructure": {
            // Upgrade to next level
            const level = state[action.structure].level + 1;
            const structureStore: StructureStoreState = {
                ...state[action.structure],
                level,
            };
            return {
                ...state,
                [action.structure]: structureStore,
            };
        }
        case "increaseWorkers": {
            const { workers: workersToAdd } = action;
            const workers = state[action.structure].workers + workersToAdd;
            const structureStore: StructureStoreState = {
                ...state[action.structure],
                workers,
            };
            return {
                ...state,
                [action.structure]: structureStore,
            };
        }
        case "decreaseWorkers": {
            const { workers: workersToRemove } = action;
            const workers = state[action.structure].workers - workersToRemove;
            const structureStore: StructureStoreState = {
                ...state[action.structure],
                workers,
            };
            return {
                ...state,
                [action.structure]: structureStore,
            };
        }
        case "setStructureState": {
            const { state: structureState } = action;
            return updateStructureState(state, action.structure, structureState);
        }
        case "addItemToToProduces": {
            // Adds given item to a structures' `produces` list
            if (isProductionStructure(action.structure)){
                return state;
            }

            const { item } = action;
            const produces = [
                ...(state[action.structure] as ProductionStructureStoreState).produces,
                item
            ];
            const structureStore: ProductionStructureStoreState = {
                ...state[action.structure],
                produces,
            };
            return {
                ...state,
                [action.structure]: structureStore,
            };
        }
        case "gameTick": {
            return state;
            // todo: harvest
        }
    }
    return state;
};

const updateStructureState = (state: StructuresStoreState, structure: Structure, structureState: StructureState) => {
    const structureStore: StructureStoreState = {
        ...state[structure],
        state: structureState,
    };
    return {
        ...state,
        [structure]: structureStore,
    };
};


export const structureInitialState: StructureStoreState = {
    level: 0,
    state: StructureState.NotBuilt,
    workers: 0,
};

export const initialStructuresState: StructuresStoreState = {
    [Structure.alchemist]:  { ...structureInitialState, produces: [ ] },
    [Structure.armoursmith]: { ...structureInitialState, produces: [ "apparel/boots1" ] },
    [Structure.garden]: { level: 0, workers: 0, state: StructureState.Built  }, // TODO: change back to NotBuilt
    [Structure.lumberMill]: structureInitialState,
    [Structure.mine]: { level: 0, workers: 0, state: StructureState.NotBuilt  },
    [Structure.quarry]: structureInitialState,
    [Structure.tavern]: { level: 0, workers: 0, state: StructureState.Built },
    [Structure.tannery]: structureInitialState,
    [Structure.warehouse]: { level: 0, workers: 0, state: StructureState.Built},
    [Structure.weaponsmith]:  { ...structureInitialState, produces: [ "weapon/simpleCrossbow", "weapon/dagger" ] },
    [Structure.weaver]: structureInitialState,
    [Structure.workshop]:  { ...structureInitialState, produces: [ "questItem/torch", "questItem/sandwich" ] },
};
