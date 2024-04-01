import { type Action } from 'store/actions'
import { /* lastAdventurerAction, */ type AppMiddlewareAPI } from './utils'

export const traitsMiddleware = (_storeApi: AppMiddlewareAPI) => (next: (action: Action) => Action) => (action: Action) => {
  // const state = storeApi.getState()

  // for (const adventurer of state.adventurers) {
  // const lastAction = lastAdventurerAction(adventurer, action, storeApi)
  // (adventurer.traits ?? []).forEach(trait => {

  // })
  // }
  next(action)
}
