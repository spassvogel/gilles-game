import { getWeaponOrApparelDefinition } from "definitions/items";
import { isAmmunition } from "definitions/items/ammunition";
import { AdventurerStoreState, } from "store/types/adventurer";
import { entries } from "utils/typescript";
import { EffectSource, EffectSourceType, EffectType, EffectWithSource } from "./types";

export type EffectDefinition = {
  harmful: boolean;
}

const all = {
  [EffectType.attributeIncrease]: {
    harmful: false
  },
  [EffectType.healthDecreaseOnMove]: {
    harmful: true
  },
  [EffectType.healthDecreaseOverTime]: {
    harmful: true
  }
};

export default all;
export const getDefinition = (effectType: EffectType): EffectDefinition  => {
  return all[effectType] as unknown as EffectDefinition;
}


// returns all effects on an adventurer (temp effects, equipment etc)
export const collectEffects = (adventurer: AdventurerStoreState, filterType?: EffectType): EffectWithSource[] => {
  const result: EffectWithSource[] = [];

  // Add effects from temp effects
  adventurer.tempEffects.forEach(tempEffect => {
    tempEffect.effects.forEach(e => {
      if (filterType === undefined || filterType === e.type) {
        const source: EffectSource = {
          type: EffectSourceType.tempEffect,
          tempEffectType: tempEffect.type
        }

        result.push({
          ...e,
          source
        });
      }
    })
  })

  // Add effects from equipment
  entries(adventurer.equipment).forEach((entry) => {
    if (!entry) return;
    const [_, item] = entry;
    if (!item || isAmmunition(item.type)) return;

    const def = getWeaponOrApparelDefinition(item.type)
      def.effects?.forEach(e => {
        if (filterType === undefined || filterType === e.type) {
          const source: EffectSource = {
            type: EffectSourceType.item,
            itemType: item.type
          }

          result.push({
            ...e,
            source
          });
        }
      })
    })

    return result;
}
