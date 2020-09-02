import { ActionType, StructureStateAction, WorkerCountAction, AddItemToProducesAction } from "actions/structures";
import { Structure } from "definitions/structures";
import { AnyAction, Reducer } from "redux";
import { StructureState, StructureStoreState } from "stores/structure";
import { initialState, StructuresStoreState } from "../stores/structures";

/**
 * reducer
 * @param state
 * @param action
 */
export const structures: Reducer<StructuresStoreState, AnyAction> = (state: StructuresStoreState = initialState,
                                                                     action: AnyAction) => {
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
