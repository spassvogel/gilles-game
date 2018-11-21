import { Reducer } from 'redux';
import { EquipmentStoreState, initialState } from '../stores/equipment';
import { INCREMENT_RESOURCE } from '../constants/index';
import { IncrementStructure } from '../actions';


/**
 * Weapons reducer
 * @param state 
 * @param action 
 */
export const equipment : Reducer<EquipmentStoreState> = (state:EquipmentStoreState = initialState, action: IncrementStructure) => {
    switch (action.type) {
        case INCREMENT_RESOURCE:
            if(state[action.resource] === undefined) return state;

            return { 
                ...state,                    
                [action.resource]: state[action.resource] + 1
            };                
    } 
    return state;
}