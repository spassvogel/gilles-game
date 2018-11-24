import { Reducer, AnyAction } from 'redux';
import { ModifyGoldAction, Action, ActionType } from 'src/actions/gold';

/**
 * reducer
 * @param state 
 * @param action 
 */
export const gold : Reducer<number> = (state:number = 0, action:Action) => {
    switch (action.type) {
        case ActionType.addGold:
        console.log('adding gold ')
            // Adds (or subtract, if negative) gold from the players gold supply
            return state + (action as ModifyGoldAction).value;        
    } 
    return state;
}