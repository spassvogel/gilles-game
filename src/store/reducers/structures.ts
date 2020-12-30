import { AnyAction, Reducer } from "redux";
import { ActionType, StructureStateAction, WorkerCountAction, AddItemToProducesAction } from "store/actions/structures";
import { Structure } from "definitions/structures";
import { StructureState, StructureStoreState } from "store/types/structure";
import { StructuresStoreState } from "store/types/structures";
import { Item } from "definitions/items/types";

/**
 * reducer
 * @param state
 * @param action
 */
export const structures: Reducer<StructuresStoreState, AnyAction> = (state: StructuresStoreState = initialStructuresState, action: AnyAction) => {
    switch (action.type) {
        case ActionType.startBuildingStructure: {
            return updateStructureState(state, action.structure, StructureState.Building);
        }
        case ActionType.finishBuildingStructure: {
            return updateStructureState(state, action.structure, StructureState.Built);
        }
        case ActionType.upgradeStructure: {
            const level = state[action.structure].level + 1;
            const structureStore: StructureStoreState = {
                ...state[action.structure],
                level,
            };
            return    {
                ...state,
                [action.structure]: structureStore,
            };
        }
        case ActionType.increaseWorkers: {
            const { workers: workersToAdd } = action as WorkerCountAction;
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
        case ActionType.decreaseWorkers: {
            const { workers: workersToRemove } = action as WorkerCountAction;
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
        case ActionType.setStructureState: {
            const { state: structureState } = action as StructureStateAction;
            return updateStructureState(state, action.structure, structureState);
        }

        case ActionType.addItemToToProduces: {
            // Adds given item to a structures' `produces` list
            const { item } = action as AddItemToProducesAction;
            const produces = [...state[action.structure].produces, item];
            const structureStore: StructureStoreState = {
                ...state[action.structure],
                produces,
            };
            return {
                ...state,
                [action.structure]: structureStore,
            };
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
    [Structure.armoursmith]: { ...structureInitialState, produces: [ Item.boots1 ] },
    [Structure.garden]: { level: 0, workers: 0, state: StructureState.Built  }, // TODO: change back to NotBuilt
    [Structure.lumberMill]: structureInitialState,
    [Structure.mine]: { level: 0, workers: 0, state: StructureState.NotBuilt  },
    [Structure.quarry]: structureInitialState,
    [Structure.tavern]: { level: 0, workers: 0, state: StructureState.Built },
    [Structure.tannery]: structureInitialState,
    [Structure.warehouse]: { level: 0, workers: 0, state: StructureState.Built},
    [Structure.weaponsmith]:  { ...structureInitialState, produces: [ Item.simpleCrossbow, Item.dagger ] },
    [Structure.weaver]: structureInitialState,
    [Structure.workshop]:  { ...structureInitialState, produces: [ Item.torch, Item.sandwich ] },
};
