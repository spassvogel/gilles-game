import { Reducer } from 'redux';
import { Action, ActionType, ModifyWorkersAction } from 'src/actions';

/**
 * reducer
 * @param state 
 * @param action 
 */
export const workers : Reducer<number> = (state:number = 200, action:Action) => {
    switch (action.type) {
        case ActionType.addWorkers:
            // Adds (or subtract, if negative) from the players workers
            return state + (action as ModifyWorkersAction).value;        
    } 
    return state;
}