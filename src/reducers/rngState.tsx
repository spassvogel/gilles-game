import { Reducer } from "redux";
import { State as seedrandomStateType } from "seedrandom";
import { ActionType, GameTickAction } from "src/actions/game";

const initialState = false;
/**
 * reducer
 * @param state
 * @param action
 */
export const rngState: Reducer<seedrandomStateType> = (state: seedrandomStateType = initialState,
                                                       action: GameTickAction) => {
    if (action.type === ActionType.gameTick && action.rngState != null) {
        state = Object.assign({}, action.rngState);
    }
    return state;
};
