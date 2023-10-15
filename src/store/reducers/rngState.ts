import { type Reducer } from 'redux'
import { type GameTickActionExt } from 'store/middleware/gameTick'
import { type SeedRandomState } from 'store/types/seedRandom'

export const initialRngState = {
  i: 0, j: 0, S: []
}

/**
 * reducer
 * @param state
 * @param action
 */
export const rngState: Reducer<SeedRandomState, GameTickActionExt> = (state = initialRngState, action) => {
  if (action.type === 'gameTick' && action.rngState != null) {
    state = Object.assign({}, action.rngState)
  }
  return state ?? initialRngState
}
