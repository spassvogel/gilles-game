import { Reducer } from 'redux';
import { EquipmentStoreState, initialState } from '../stores/equipment';
import { ActionType, Action } from 'src/actions/equipment';


/**
 * Equipment reducer
 * @param state 
 * @param action 
 */
export const equipment : Reducer<EquipmentStoreState> = (state:EquipmentStoreState = initialState, action:Action) => {
    switch (action.type) {
        case ActionType.craft:
            const equipment = action.productionDefinition.equipment;
            return { 
                ...state,                    
                [equipment]: state[equipment] + 1
            };                
    } 
    return state;
}