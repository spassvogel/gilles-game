import { Middleware } from 'redux'
import { Action } from 'store/actions'
import { StoreState } from 'store/types'
import { /*lastAdventurerAction, */ AppMiddlewareAPI } from './utils'

export const traitsMiddleware: Middleware<
  unknown,
  StoreState
> = (storeApi: AppMiddlewareAPI) => next => (action: Action) => {
  // const state = storeApi.getState()

  //for (const adventurer of state.adventurers) {
    // const lastAction = lastAdventurerAction(adventurer, action, storeApi);
    // (adventurer.traits ?? []).forEach(trait => {
      
    // })
  //}
  next(action);
}

