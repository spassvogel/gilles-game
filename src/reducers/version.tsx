import { Reducer } from "redux";
import { Action, ActionType, ModifyWorkersAction } from "actions";

/**
 * reducer
 * @param state
 * @param action
 */
export const workers: Reducer<number> = (state: number = 13, action: Action) => {
    switch (action.type) {
        case ActionType.addWorkers:
            // Adds (or subtract, if negative) from the players workers
            return state + (action as ModifyWorkersAction).value;
    }
    return state;
};
