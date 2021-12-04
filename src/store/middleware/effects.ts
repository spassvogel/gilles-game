import { Middleware } from 'redux'
import { Action } from 'store/actions'
import { StoreState } from 'store/types'

export const effectsMiddleware: Middleware<
  unknown, // Most middleware do not modify the dispatch return value
  StoreState
> = storeApi => next => (action: Action) => {
  const state = storeApi.getState()
  console.log('effects middleware', action)
  next(action);
}
