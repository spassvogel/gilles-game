import { TraitDefinition, Trait } from './types';

const all = {
  [Trait.arrowFinder]: {
    trait: Trait.arrowFinder,
    hasEffect: true
  },
  [Trait.gloomy]: {
    trait: Trait.gloomy,
    hasEffect: true
  },
  [Trait.houseHouston]: {
    trait: Trait.houseHouston,
  },
  [Trait.houseMaddox]: {
    trait: Trait.houseMaddox,
  },
  [Trait.houseMonroe]: {
    trait: Trait.houseMonroe,
  }
};

export function getDefinition(trait: Trait): TraitDefinition {
  return all[trait];
}