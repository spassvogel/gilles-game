import { Reducer } from 'redux';
import { StructuresStoreState, initialState } from '../stores/structures';
import { SET_STRUCTURE_AMOUNT } from '../constants/index';
import { StructureAction } from '../actions';


/**
 * reducer
 * @param state 
 * @param action 
 */
export const structures : Reducer<StructuresStoreState> = (state:StructuresStoreState = initialState, action: StructureAction) => {
    switch (action.type) {
        case SET_STRUCTURE_AMOUNT:
            if(state[action.structure] === undefined) return state;

            return { 
                ...state,                    
                [action.structure]: action.amount
            };                
    } 
    return state;
}