import { type Middleware } from 'redux'
import { type Action } from 'store/actions'
import { type StoreState } from 'store/types'
import { /* lastAdventurerAction, */ type AppMiddlewareAPI } from './utils'

export const traitsMiddleware: Middleware<
unknown,
StoreState
> = (_storeApi: AppMiddlewareAPI) => next => (action: Action) => {
  // const state = storeApi.getState()

  // for (const adventurer of state.adventurers) {
  // const lastAction = lastAdventurerAction(adventurer, action, storeApi)
  // (adventurer.traits ?? []).forEach(trait => {

  // })
  // }
  next(action)
}
