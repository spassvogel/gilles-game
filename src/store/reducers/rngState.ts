import { GameAction } from "store/actions/game";
import { AnyAction, Reducer } from "redux";
import { State as seedrandomStateType } from "seedrandom";

export const initialRngState = false;
/**
 * reducer
 * @param state
 * @param action
 */
export const rngState: Reducer<seedrandomStateType, AnyAction> = (state: seedrandomStateType = initialRngState, action: GameAction) => {
    if (action.type === "gameTick" && action.rngState != null) {
        state = Object.assign({}, action.rngState);
    }
    return state;
};
