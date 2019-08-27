import { ActionType, ModifyWorkersAction } from "actions";
import { AnyAction, Reducer } from "redux";

/**
 * reducer
 * @param state
 * @param action
 */
export const workers: Reducer<number> = (state: number = 13, action: AnyAction) => {
    switch (action.type) {
        case ActionType.addWorkers:
            // Adds (or subtract, if negative) from the players workers
            return state + (action as ModifyWorkersAction).value;
    }
    return state;
};
