import { EffectSoma, EffectType } from "definitions/effects/types";
import { AdventurerStoreState, Attribute, AttributesStoreState } from "store/types/adventurer";
import { entries } from "utils/typescript";
import { getWeaponOrApparelDefinition } from "definitions/items";
import { isAmmunition } from "definitions/items/ammunition";
import { ItemType } from "definitions/items/types";

export type AttributesExtended = {
  [key in Attribute]: ExtendedAttributeComponents[]
}

export type ExtendedAttribute = {
  attribute: Attribute;
  components: ExtendedAttributeComponents[];
}

export type ExtendedAttributeComponents = {
  origin: AttributeSource,
  value: number
}

export enum AttributeSourceType {
  base,
  item,
  soma
}

// The source of the attribute modifier
export type AttributeSource = {
  type: AttributeSourceType.base
} | {
  type: AttributeSourceType.soma
} | {
  type: AttributeSourceType.item
  item: ItemType
}

export const calculateEffectiveAttributes = (adventurer: AdventurerStoreState): AttributesStoreState  => {
  const extended = calculateEffectiveAttributesExtended(adventurer);
  return {
    str: extended.str.reduce((acc, value) => (acc + value.value), 0),
    for: extended.for.reduce((acc, value) => (acc + value.value), 0),
    int: extended.int.reduce((acc, value) => (acc + value.value), 0),
    agi: extended.agi.reduce((acc, value) => (acc + value.value), 0),
  }
}

// Returns the extended list of effective attributes (where each component comes from)
export const calculateEffectiveAttributesExtended = (adventurer: AdventurerStoreState): AttributesExtended  => {
  const result = generateBaseAttributes(adventurer.basicAttributes);

  // Add effects of soma
  const somaEffects = adventurer.effects.filter(e => e.type === EffectType.soma) as EffectSoma[];
  if (somaEffects.length > 0) {
    const ordered = somaEffects.sort((a: EffectSoma, b: EffectSoma) => b.factor - a.factor);
    // the biggest soma counts
    const top = ordered[0];
    const origin: AttributeSource = { type: AttributeSourceType.soma };
    result.str.push({ origin, value: adventurer.basicAttributes.str * top.factor - adventurer.basicAttributes.str})
    result.for.push({ origin, value: adventurer.basicAttributes.for * top.factor - adventurer.basicAttributes.for})
    result.int.push({ origin, value: adventurer.basicAttributes.int * top.factor - adventurer.basicAttributes.int})
    result.agi.push({ origin, value: adventurer.basicAttributes.agi * top.factor - adventurer.basicAttributes.agi})
  }

  // Add effects from equipment
  entries(adventurer.equipment).forEach((entry) => {
    if (!entry) return;
    const [_, item] = entry;
    if (!item || isAmmunition(item.type)) return;

    const def = getWeaponOrApparelDefinition(item.type)
      def.effects?.forEach(e => {
      if (e.type === EffectType.attributeIncrease) {
        const origin: AttributeSource = {
          type: AttributeSourceType.item,
          item: item.type
        };

        result[e.attribute].push({
          origin,
          value: adventurer.basicAttributes[e.attribute] * e.factor - adventurer.basicAttributes[e.attribute]
        })
      }
      })
  })

  return result;
}

// Turns base attribues into AttributesExtended
export const generateBaseAttributes = (basicAttributes: AttributesStoreState): AttributesExtended => {
  const origin: AttributeSource = { type: AttributeSourceType.base };

  return {
    str: [{ origin, value: basicAttributes.str }],
    for: [{ origin, value: basicAttributes.for }],
    int: [{ origin, value: basicAttributes.int }],
    agi: [{ origin, value: basicAttributes.agi }]
  }
}

