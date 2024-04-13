import { type Reducer } from 'redux'
import { type GameAction } from 'store/actions/game'
import { type GameStoreState } from 'store/types/game'
import { asInt } from 'utils/version'

export const initialGameState: GameStoreState = {
  version: asInt,
  tutorial: 0
}
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
        ignoreVersionDiff: asInt
      }
    }

    case 'skipTutorial': {
      return {
        ...state,
        tutorial: -1
      }
    }

    case 'nextTutorialStep': {
      return {
        ...state,
        tutorial: state.tutorial + 1
      }
    }
  }
  return state
}
