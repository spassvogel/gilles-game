import { AnyAction, Reducer } from "redux";
import { seedrandomStateType } from "seedrandom";
import { ActionType, GameTick } from "src/actions/game";

const initialState = false;
/**
 * reducer
 * @param state
 * @param action
 */
export const rngState: Reducer<seedrandomStateType> = (state: seedrandomStateType = initialState,
                                                       action: GameTick) => {
        if (action.type === ActionType.gameTick) {
            state =  Object.assign({}, action.rngState)
        }
        return state;
};
