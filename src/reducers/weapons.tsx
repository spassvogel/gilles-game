import { Reducer } from 'redux';
import { WeaponsStoreState } from '../types/index';
import { INCREMENT_RESOURCE } from '../constants/index';
import { IncrementResource } from '../actions';


let initialWeaponsState:WeaponsStoreState = {
    crossbows: 0,
    daggers: 0,
    longbows: 0,
    swords: 0
}
/**
 * Weapons reducer
 * @param state 
 * @param action 
 */
export const weapons : Reducer<WeaponsStoreState> = (state:WeaponsStoreState = initialWeaponsState, action: IncrementResource) => {
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