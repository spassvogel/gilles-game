import { Reducer } from 'redux';
import { State as seedrandomStateType } from 'seedrandom';
import { GameAction } from 'store/actions/game';

export const initialRngState = {};
/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const rngState: Reducer<seedrandomStateType, GameAction> = (state = initialRngState, action) => {
  if (action.type === 'gameTick' && action.rngState != null) {
    state = Object.assign({}, action.rngState);
  }
  return state;
};
