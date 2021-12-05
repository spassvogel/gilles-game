import { EffectType } from 'mechanics/effects/types'
import { Middleware } from 'redux'
import { Action } from 'store/actions'
import { addHealth } from 'store/actions/adventurers'
import { StoreState } from 'store/types'
import { SceneActionType } from 'store/types/scene'
import { lastAdventurerAction, AppMiddlewareAPI } from './utils'

export const effectsMiddleware: Middleware<
  unknown, // Most middleware do not modify the dispatch return value
  StoreState
> = (storeApi: AppMiddlewareAPI) => next => (action: Action) => {
  const state = storeApi.getState()

  for (const adventurer of state.adventurers) {
    const lastAction = lastAdventurerAction(adventurer, action, storeApi);
    (adventurer.effects ?? []).forEach(effect => {
      // processEffect(effect, adventurer, action, storeApi)
      switch (effect.type) {
        case EffectType.brokenLegs: {
          if (lastAction === SceneActionType.move) {
            console.log("last action for", adventurer.name, "moved");
            storeApi.dispatch(addHealth(adventurer.id, -5))
          }
        }
      }
    })
  }
  next(action);
}

