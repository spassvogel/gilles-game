import { type TraitDefinition, Trait } from './types'

const all = {
  [Trait.arrowFinder]: {
    trait: Trait.arrowFinder,
    hasEffect: true
  },
  [Trait.gloomy]: {
    trait: Trait.gloomy,
    hasEffect: true
  },
  [Trait.lucky]: {
    trait: Trait.lucky,
    hasEffect: true
  },
  [Trait.houseHouston]: {
    trait: Trait.houseHouston
  },
  [Trait.houseMaddox]: {
    trait: Trait.houseMaddox
  },
  [Trait.houseMonroe]: {
    trait: Trait.houseMonroe
  }
}

export const getDefinition = (trait: Trait): TraitDefinition => {
  return all[trait]
}
