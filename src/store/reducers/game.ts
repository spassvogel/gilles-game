import { Reducer } from 'redux';
import { GameAction } from 'store/actions/game';
import { GameStoreState } from 'store/types/game';
import * as Version from 'constants/version';

export const initialGameState: GameStoreState = {
  version: Version.asInt,
};
/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const game: Reducer<GameStoreState, GameAction> = (state = initialGameState, action) => {
  switch (action.type) {
    // when user dismisses the warning about version incompatibility
    case 'ignoreVersionDiff': {
      return {
        ...state,
        ignoreVersionDiff: Version.asInt,
      };
    }
  }
  return state;
};

