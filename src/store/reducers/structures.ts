import { AnyAction, Reducer } from "redux";
import { ActionType, StructureStateAction, WorkerCountAction, AddItemToProducesAction, StructureAction } from "store/actions/structures";
import { Structure } from "definitions/structures";
import { ProductionStructureStoreState, StructureState, StructureStoreState } from "store/types/structure";
import { isProductionStructure, StructuresStoreState } from "store/types/structures";
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
            return upgradeStructureState(state, action as StructureAction);
        }
        case ActionType.increaseWorkers: {
            return increaseWorkers(state, action as WorkerCountAction);
        }
        case ActionType.decreaseWorkers: {
            return decreaseWorkers(state, action as WorkerCountAction);
        }
        case ActionType.setStructureState: {
            const { state: structureState } = action as StructureStateAction;
            return updateStructureState(state, action.structure, structureState);
        }
        case ActionType.addItemToToProduces: {
            return addItemToToProduces(state, action as AddItemToProducesAction)
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

const upgradeStructureState = (state: StructuresStoreState, action: StructureAction) => {
    const level = state[action.structure].level + 1;
    const structureStore: StructureStoreState = {
        ...state[action.structure],
        level,
    };
    return {
        ...state,
        [action.structure]: structureStore,
    };

};

const increaseWorkers = (state: StructuresStoreState, action: WorkerCountAction) => {
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

const decreaseWorkers = (state: StructuresStoreState, action: WorkerCountAction) => {
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

const addItemToToProduces = (state: StructuresStoreState, action: AddItemToProducesAction) => {
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
