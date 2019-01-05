import { Reducer } from "redux";
import { Action, ActionType } from "src/actions/structures";
import { Structure } from "src/definitions/structures";
import { StructureState, StructureStoreState } from "src/stores/structure";
import { initialState, StructuresStoreState } from "../stores/structures";

/**
 * reducer
 * @param state
 * @param action
 */
export const structures: Reducer<StructuresStoreState> = (state: StructuresStoreState = initialState,
                                                          action: Action) => {
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
