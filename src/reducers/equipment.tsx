import { Reducer } from 'redux';
import { EquipmentStoreState, initialState } from '../stores/equipment';
import { INCREMENT_RESOURCE } from '../constants/index';
import { StructureAction } from 'src/actions';


/**
 * Weapons reducer
 * @param state 
 * @param action 
 */
export const equipment : Reducer<EquipmentStoreState> = (state:EquipmentStoreState = initialState, action: StructureAction) => {
    // switch (action.type) {
    //     case INCREMENT_RESOURCE:
    //         if(state[action.resource] === undefined) return state;

    //         return { 
    //             ...state,                    
    //             [action.resource]: state[action.resource] + 1
    //         };                
    // } 
    return state;
}