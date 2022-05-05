import { Reducer } from 'redux';
import { State as seedrandomStateType } from 'seedrandom';
import { GameTickActionExt } from 'store/middleware/gameTick';

export const initialRngState = {};
/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const rngState: Reducer<seedrandomStateType, GameTickActionExt> = (state = initialRngState, action) => {
  if (action.type === 'gameTick' && action.rngState != null) {
    state = Object.assign({}, action.rngState);
  }
  return state;
};
