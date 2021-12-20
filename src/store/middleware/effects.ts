import { Effect, EffectSoma, EffectType } from 'definitions/effects/types'
import { getDefinition, isConsumable } from 'definitions/items/consumables'
import { Middleware } from 'redux'
import { Action } from 'store/actions'
import { addEffect, decreaseEffectCharge, modifyHealth } from 'store/actions/adventurers'
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
      switch (effect.type) {
        case EffectType.brokenLegs: {
          // Broken legs effect reduces health at every move
          if (lastAction === SceneActionType.move) {
            storeApi.dispatch(modifyHealth(adventurer.id, -5));

            effectTick(storeApi, effect, adventurer.id);
          }
        }
      }
    })
  }

  switch (action.type) {
    case "consumeItem": {
      // Apply effect after consuming item
      const { adventurerId, fromSlot } = action;
      const adventurer = state.adventurers.find((a) => a.id === adventurerId);
      if (!adventurer) {
        throw new Error(`No adventurer ${adventurerId} found`)
      }
      const consumable = adventurer.inventory[fromSlot];
      if (!consumable || !isConsumable(consumable.type)) {
        throw new Error(`No potion found at index ${fromSlot} `)
      }
      const definition = getDefinition(consumable.type);
      switch (definition.category) {
        case "soma": {

          storeApi.dispatch(addEffect<EffectSoma>(adventurerId, {
            type: EffectType.soma,
            factor: definition.effect ?? 1
          }))
        }
      }
    }
  }

  next(action);
}

const effectTick = (storeApi: AppMiddlewareAPI, effect: Effect, adventurerId: string) => {
  if (effect.charges) {
    storeApi.dispatch(decreaseEffectCharge(adventurerId, effect))
  }
}

