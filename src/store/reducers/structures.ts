import { Reducer } from "redux";
import { isProductionStructure, isResourceStructure, ResourceStructure, Structure } from "definitions/structures";
import { ProductionStructureStoreState, StructureState, StructureStoreState } from "store/types/structure";
import { StructuresStoreState } from "store/types/structures";
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
        case "removeItemFromHarvest": {
            // Should always be false but typescript doesnt know that
            if (!isResourceStructure(action.structure)) return state;
            const harvest = state[action.structure].harvest?.filter((h, i) => (i !== action.index));
            return { 
                ...state,
                [action.structure]: {
                    ...state[action.structure],
                    harvest
                }
            }
        }
        case "gameTick": {
            if (!action.harvest || !Object.keys(action.harvest)?.length) {
                return state;
            }
            // Copies harvest from harvest into structure
            return Object.keys(state).reduce<StructuresStoreState>((acc, structureAsString) => {
                const structure = structureAsString as Structure;
                if (isResourceStructure(structure) && action.harvest?.[structure]?.length){
                    const harvest = action.harvest[structure]
                    acc[structure as ResourceStructure].harvest = [
                        ...(acc[structure as ResourceStructure].harvest ?? []), 
                        ...harvest ?? []
                    ]
                }
                return acc;
            }, state);
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


const structureInitialState: StructureStoreState = {
    level: 0,
    state: StructureState.NotBuilt,
    workers: 0,
};

export const initialStructuresState: StructuresStoreState = {
    alchemist: { ...structureInitialState, produces: [ ] },
    armoursmith: { ...structureInitialState, produces: [ "apparel/boots1" ] },
    garden: { level: 0, workers: 0, state: StructureState.Built  }, // TODO: change back to NotBuilt
    lumberMill: structureInitialState,
    mine: { level: 0, workers: 0, state: StructureState.NotBuilt  },
    quarry: structureInitialState,
    tavern: { level: 0, workers: 0, state: StructureState.Built },
    tannery: structureInitialState,
    warehouse: { level: 0, workers: 0, state: StructureState.Built},
    weaponsmith:  { ...structureInitialState, produces: [ "weapon/simpleCrossbow", "weapon/dagger" ] },
    weaver: structureInitialState,
    workshop: { ...structureInitialState, produces: [ "questItem/torch", "questItem/sandwich" ] },
};
