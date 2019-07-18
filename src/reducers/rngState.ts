import { ActionType, GameTickAction } from "actions/game";
import { Reducer } from "redux";
import { State as seedrandomStateType } from "seedrandom";

const initialState = false;
/**
 * reducer
 * @param state
 * @param action
 */
export const rngState: Reducer<seedrandomStateType, GameTickAction> = (state: seedrandomStateType = initialState,
                                                                       action: GameTickAction) => {
    if (action.type === ActionType.gameTick && action.rngState != null) {
        state = Object.assign({}, action.rngState);
    }
    return state;
};
