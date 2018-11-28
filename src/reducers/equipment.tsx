import { Reducer } from 'redux';
import { EquipmentStoreState, initialState } from '../stores/equipment';
import { ActionType, Action, AddAction } from 'src/actions/equipment';


/**
 * Equipment reducer
 * @param state 
 * @param action 
 */
export const equipment : Reducer<EquipmentStoreState> = (state:EquipmentStoreState = initialState, action:Action) => {
    switch (action.type) {
        case ActionType.addEquipment:
            const equipment = (action as AddAction).equipment;
            return { 
                ...state,                    
                [equipment]: state[equipment] + 1
            };                
    } 
    return state;
}