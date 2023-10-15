import { type Reducer } from 'redux'
import { type WorkersAction } from 'store/actions/workers'

export const initialWorkersState = 13

/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const workers: Reducer<number, WorkersAction> = (state = initialWorkersState, action) => {
  switch (action.type) {
    case 'addWorkers':
      // Adds (or subtract, if negative) from the players workers
      return state + action.value
  }
  return state
}
