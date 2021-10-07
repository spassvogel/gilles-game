import { Reducer } from "redux";
import { State as seedrandomStateType } from "seedrandom";
import { GameAction } from "store/actions/game";

export const initialRngState = false;
/**
 * reducer
 * @param state
 * @param action
 */
export const rngState: Reducer<seedrandomStateType, GameAction> = (state = initialRngState, action) => {
  if (action.type === "gameTick" && action.rngState != null) {
    state = Object.assign({}, action.rngState);
  }
  return state;
};
