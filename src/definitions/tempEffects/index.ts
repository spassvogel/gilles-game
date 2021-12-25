import { Effect, EffectType } from "definitions/effects/types"
import { Attribute, attributeList } from "store/types/adventurer"
import { TempEffect, TempEffectType } from "./types"

export type EffectDefinition = {
  harmful: boolean;
}

// given all props of TempEffect of
export const createTempEffect = <T extends TempEffect> (tempEffect: Omit<T, 'effects'>) => {
  return {
    ...tempEffect,
    effects: getEffects(tempEffect)
  }
}

export const getEffects = <T extends TempEffect> (tempEffect: Omit<T, 'effects'>): Effect[] => {
  const t = tempEffect as T;
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
    case TempEffectType.soma: {
      return attributeList.map((attribute: Attribute) => ({
        type: EffectType.attributeIncrease,
        attribute,
        factor: t.factor
      }))
    }
    default:
      return [];
  }
}

// const all = {
//   [EffectType.attributeIncrease]: {
//     harmful: false
//   },
//   [EffectType.brokenLegs]: {
//     harmful: true
//   },
//   [EffectType.burning]: {
//     harmful: true
//   },
//   [EffectType.soma]: {
//     harmful: false
//   }
// };

// export default all;
// export function getDefinition(effectType: EffectType): EffectDefinition {
//   return all[effectType] as unknown as EffectDefinition;
// }
