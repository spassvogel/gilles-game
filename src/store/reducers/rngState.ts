import { Reducer } from "redux";
import { State as seedrandomStateType } from "seedrandom";
import { Action } from "store/actions";

export const initialRngState = false;
/**
 * reducer
 * @param state
 * @param action
 */
export const rngState: Reducer<seedrandomStateType> = (state: seedrandomStateType = initialRngState, action: Action) => {
    if (action.type === "gameTick" && action.rngState != null) {
        state = Object.assign({}, action.rngState);
    }
    return state;
};
