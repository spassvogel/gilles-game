import { collectEffects } from 'definitions/effects'
import { type Effect, EffectType } from 'definitions/effects/types'
import { getDefinition, isConsumable } from 'definitions/items/consumables'
import { createTempEffect } from 'definitions/tempEffects'
import { type TempEffectSoma, TempEffectType } from 'definitions/tempEffects/types'
import { type Middleware } from 'redux'
import { type Action } from 'store/actions'
import { addTempEffect, decreaseEffectCharge, modifyHealth } from 'store/actions/adventurers'
import { type StoreState } from 'store/types'
import { SceneActionType } from 'store/types/scene'
import { lastAdventurerAction, type AppMiddlewareAPI } from './utils'

const effectTick = (storeApi: AppMiddlewareAPI, effect: Effect, adventurerId: string) => {
  if (effect.charges === undefined || effect.charges === 0) {
    storeApi.dispatch(decreaseEffectCharge(adventurerId, effect))
  }
}

// character effect
export const effectsMiddleware: Middleware<unknown, StoreState> = (storeApi: AppMiddlewareAPI) => next => (action: Action) => {
  const state = storeApi.getState()

  for (const adventurer of state.adventurers) {
    const lastAction = lastAdventurerAction(adventurer, action, storeApi)
    const effects = collectEffects(adventurer)
    effects.forEach(effect => {
      switch (effect.type) {
        case EffectType.healthDecreaseOnMove: {
          // Broken legs effect reduces health at every move
          if (lastAction === SceneActionType.move) {
            storeApi.dispatch(modifyHealth(adventurer.id, -5))

            effectTick(storeApi, effect, adventurer.id)
          }
        }
      }
    })
  }

  switch (action.type) {
    case 'consumeItem': {
      // Apply effect after consuming item
      const { adventurerId, fromSlot } = action
      const adventurer = state.adventurers.find((a) => a.id === adventurerId)
      if (adventurer == null) {
        throw new Error(`No adventurer ${adventurerId} found`)
      }
      const consumable = adventurer.inventory[fromSlot]
      if ((consumable == null) || !isConsumable(consumable.type)) {
        throw new Error(`No potion found at index ${fromSlot} `)
      }
      const definition = getDefinition(consumable.type)
      switch (definition.category) {
        case 'soma': {
          const tempEffect = createTempEffect<TempEffectSoma>({
            type: TempEffectType.soma,
            factor: definition.effect ?? 1
          })
          storeApi.dispatch(addTempEffect(adventurerId, tempEffect))
        }
      }
    }
  }

  next(action)
}
