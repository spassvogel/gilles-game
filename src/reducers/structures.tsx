import { Reducer } from "redux";
import { Action, ActionType, StructureStateAction } from "src/actions/structures";
import { StructureStoreState } from "src/stores/structure";
import { initialState, StructuresStoreState } from "../stores/structures";

/**
 * reducer
 * @param state
 * @param action
 */
export const structures: Reducer<StructuresStoreState> = (state: StructuresStoreState = initialState,
                                                          action: Action) => {
    switch (action.type) {
        case ActionType.setStructureState: {
            return updateStructureState(state, action as StructureStateAction);
        }
        case ActionType.upgradeStructure: {
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
        case ActionType.increaseWorkers: {
            const workers = state[action.structure].workers + 1;
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
            const workers = state[action.structure].workers - 1;
            const structureStore: StructureStoreState = {
                ...state[action.structure],
                workers,
            };
            return {
                ...state,
                [action.structure]: structureStore,
            };
        }
    }
    return state;
};

const updateStructureState = (state: StructuresStoreState, action: StructureStateAction) => {
    const structureStore: StructureStoreState = {
        ...state[action.structure],
        state: action.state,
    };
    return {
        ...state,
        [action.structure]: structureStore,
    };
}
