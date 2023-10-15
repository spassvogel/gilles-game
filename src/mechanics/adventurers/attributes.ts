import { type EffectSource, EffectSourceType, EffectType } from 'definitions/effects/types'
import { type AdventurerStoreState, type Attribute, type AttributesStoreState } from 'store/types/adventurer'
import { type ItemType } from 'definitions/items/types'
import { collectEffects } from 'definitions/effects'
import { type TempEffectType } from 'definitions/tempEffects/types'

export const MIN_VALUE = 1 // minimum value of any base attribute
export const MAX_VALUE = 20 // maximum value of any base attribute

export type AttributesExtended = {
  [key in Attribute]: ExtendedAttributeComponents[]
}

export type ExtendedAttribute = {
  attribute: Attribute
  components: ExtendedAttributeComponents[]
}

export type ExtendedAttributeComponents = {
  origin: AttributeSource
  value: number
}

export enum AttributeSourceType {
  base,
  item,
  tempEffect,
}

// The source of the attribute modifier
export type AttributeSource = {
  type: AttributeSourceType.base
} | {
  type: AttributeSourceType.tempEffect
  tempEffectType: TempEffectType
} | {
  type: AttributeSourceType.item
  item: ItemType
}

// Turns base attribues into AttributesExtended
export const generateBaseAttributes = (basicAttributes: AttributesStoreState): AttributesExtended => {
  const origin: AttributeSource = { type: AttributeSourceType.base }

  return {
    str: [{ origin, value: basicAttributes.str }],
    for: [{ origin, value: basicAttributes.for }],
    int: [{ origin, value: basicAttributes.int }],
    agi: [{ origin, value: basicAttributes.agi }]
  }
}

const convertOrigin = (effectSource: EffectSource): AttributeSource => {
  switch (effectSource.type) {
    case EffectSourceType.item: {
      return {
        type: AttributeSourceType.item,
        item: effectSource.itemType
      }
    }
    case EffectSourceType.tempEffect: {
      return {
        type: AttributeSourceType.tempEffect,
        tempEffectType: effectSource.tempEffectType
      }
    }
    // default:
    //   throw new Error(`Unknown effect source type ${effectSource.type}`)
  }
}

// Returns the extended list of effective attributes (where each component comes from)
export const calculateEffectiveAttributesExtended = (adventurer: AdventurerStoreState): AttributesExtended => {
  const result = generateBaseAttributes(adventurer.basicAttributes)

  // Add all 'attributeIncrease' effects
  collectEffects(adventurer, EffectType.attributeIncrease).forEach(effectSource => {
    const origin = convertOrigin(effectSource.source)
    if (effectSource.type === EffectType.attributeIncrease) { // this is always true but typescript doesnt know that
      const { attribute } = effectSource
      result[attribute].push({
        origin,
        value: adventurer.basicAttributes[attribute] * effectSource.factor - adventurer.basicAttributes[attribute]
      })
    }
  })
  // Add effects of soma
  // const somaEffects = adventurer.tempEffects.filter(e => e.type === EffectType.soma) as EffectSoma[]
  // if (somaEffects.length > 0) {
  //   const ordered = somaEffects.sort((a: EffectSoma, b: EffectSoma) => b.factor - a.factor)
  //   // the biggest soma counts
  //   const top = ordered[0]
  //   const origin: AttributeSource = { type: AttributeSourceType.soma }
  //   result.str.push({ origin, value: adventurer.basicAttributes.str * top.factor - adventurer.basicAttributes.str})
  //   result.for.push({ origin, value: adventurer.basicAttributes.for * top.factor - adventurer.basicAttributes.for})
  //   result.int.push({ origin, value: adventurer.basicAttributes.int * top.factor - adventurer.basicAttributes.int})
  //   result.agi.push({ origin, value: adventurer.basicAttributes.agi * top.factor - adventurer.basicAttributes.agi})
  // }

  return result
}

export const calculateEffectiveAttributes = (adventurer: AdventurerStoreState): AttributesStoreState => {
  const extended = calculateEffectiveAttributesExtended(adventurer)
  return {
    str: extended.str.reduce((acc, value) => (acc + value.value), 0),
    for: extended.for.reduce((acc, value) => (acc + value.value), 0),
    int: extended.int.reduce((acc, value) => (acc + value.value), 0),
    agi: extended.agi.reduce((acc, value) => (acc + value.value), 0)
  }
}
