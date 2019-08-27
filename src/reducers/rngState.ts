import { ActionType, GameTickAction } from "actions/game";
import { AnyAction, Reducer } from "redux";
import { State as seedrandomStateType } from "seedrandom";

const initialState = false;
/**
 * reducer
 * @param state
 * @param action
 */
export const rngState: Reducer<seedrandomStateType, AnyAction> = (state: seedrandomStateType = initialState,
                                                                  action: AnyAction) => {
    if (action.type === ActionType.gameTick && action.rngState != null) {
        state = Object.assign({}, action.rngState);
    }
    return state;
};
