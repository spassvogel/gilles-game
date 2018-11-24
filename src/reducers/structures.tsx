import { Reducer } from 'redux';
import { StructuresStoreState, initialState } from '../stores/structures';
import { StructureStoreState } from 'src/stores/structure';
import { Action, ActionType } from 'src/actions/structures';


/**
 * reducer
 * @param state 
 * @param action 
 */
export const structures : Reducer<StructuresStoreState> = (state:StructuresStoreState = initialState, action: Action) => {
    switch (action.type) {
        // case SET_STRUCTURE_AMOUNT:
        //     if(state[action.structure] === undefined) return state;

        //     return { 
        //         ...state,                    
        //         [action.structure]: action.amount
        //     };                
        case ActionType.upgradeStructure: {
            if(state[action.structure] === undefined) return state;

            const level = (state[action.structure].level || 0) + 1;
            const structureStore:StructureStoreState = {
                ...state[action.structure], 
                level
            }
            return { 
                ...state,                    
                [action.structure]: structureStore
            };       
        }
        case ActionType.increaseWorkers: {
            if(state[action.structure] === undefined) return state;

            const workers = (state[action.structure].workers || 0) + 1;
            const structureStore:StructureStoreState = {
                ...state[action.structure], 
                workers
            }
            return { 
                ...state,                    
                [action.structure]: structureStore
            };       
        }
        case ActionType.decreaseWorkers: {
            if(state[action.structure] === undefined) return state;

            const workers = (state[action.structure].workers || 0) - 1;
            const structureStore:StructureStoreState = {
                ...state[action.structure], 
                workers
            }
            return { 
                ...state,                    
                [action.structure]: structureStore
            };       
        }
    } 
    return state;
}