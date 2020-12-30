import { AnyAction, Reducer } from "redux";
import { ActionType, ModifyWorkersAction } from 'store/actions';

/**
 * reducer
 * @param state
 * @param action
 */
export const workers: Reducer<number> = (state: number = initialWorkersState, action: AnyAction) => {
    switch (action.type) {
        case ActionType.addWorkers:
            // Adds (or subtract, if negative) from the players workers
            return state + (action as ModifyWorkersAction).value;
    }
    return state;
};

export const initialWorkersState = 13;