import { EffectSoma, EffectType } from "definitions/effects/types";
import { AdventurerStoreState, Attribute, AttributesStoreState } from "store/types/adventurer";

export type AttributesExtended = {
  [key in Attribute]: ExtendedAttributeComponents[]
}

export type ExtendedAttribute = {
  attribute: Attribute;
  components: ExtendedAttributeComponents[];
}

export type ExtendedAttributeComponents = {
  origin: string,
  value: number
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

  const somaEffects = adventurer.effects.filter(e => e.type === EffectType.soma) as EffectSoma[];
  if (somaEffects.length > 0) {
    const ordered = somaEffects.sort((a: EffectSoma, b: EffectSoma) => b.factor - a.factor);
    // the biggest soma counts
    const top = ordered[0];
    result.str.push({ origin: "soma", value: adventurer.basicAttributes.str * top.factor - adventurer.basicAttributes.str})
    result.for.push({ origin: "soma", value: adventurer.basicAttributes.for * top.factor - adventurer.basicAttributes.for})
    result.int.push({ origin: "soma", value: adventurer.basicAttributes.int * top.factor - adventurer.basicAttributes.int})
    result.agi.push({ origin: "soma", value: adventurer.basicAttributes.agi * top.factor - adventurer.basicAttributes.agi})
  }

  return result;
}

// Turns base attribues into AttributesExtended
export const generateBaseAttributes = (basicAttributes: AttributesStoreState): AttributesExtended => {
  return {
    str: [{ origin: "base", value: basicAttributes.str }],
    for: [{ origin: "base", value: basicAttributes.for }],
    int: [{ origin: "base", value: basicAttributes.int }],
    agi: [{ origin: "base", value: basicAttributes.agi }]
  }
}
