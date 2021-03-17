import { Reducer } from "redux";
import { Action } from "store/actions";
import { WorkersAction } from "store/actions/workers";

/**
 * reducer
 * @param state
 * @param action
 */
export const workers: Reducer<number, WorkersAction> = (state: number = initialWorkersState, action: Action) => {
    switch (action.type) {
        case "addWorkers":
            // Adds (or subtract, if negative) from the players workers
            return state + action.value;
    }
    return state;
};

export const initialWorkersState = 13;