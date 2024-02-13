import { type Effect, EffectType } from 'definitions/effects/types'
import { type Attribute, attributeList } from 'store/types/adventurer'
import { type TempEffect, TempEffectType } from './types'

export type EffectDefinition = {
  harmful: boolean
}

export const getEffects = <T extends TempEffect> (tempEffect: Omit<T, 'effects'>): Effect[] => {
  const t = tempEffect as T
  switch (t.type) {
    case TempEffectType.brokenLegs: {
      return [{
        type: EffectType.healthDecreaseOnMove,
        damage: t.damage
      }]
    }
    case TempEffectType.burning: {
      return [{
        type: EffectType.healthDecreaseOverTime,
        interval: t.interval,
        damage: t.damage
      }]
    }
    case TempEffectType.rage: {
      return [{
        type: EffectType.damageMultiplier,
        factor: t.factor
      }]
    }
    case TempEffectType.soma: {
      return attributeList.map((attribute: Attribute) => ({
        type: EffectType.attributeIncrease,
        attribute,
        factor: t.factor
      }))
    }
    default:
      return []
  }
}

// given all props of TempEffect of
export const createTempEffect = <T extends TempEffect> (tempEffect: Omit<T, 'effects'>) => {
  return {
    ...tempEffect,
    effects: getEffects(tempEffect)
  }
}
