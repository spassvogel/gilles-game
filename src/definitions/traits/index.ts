import { TraitDefinition, Trait } from './types';

const all = {
    [Trait.arrowFinder]: {
        hasEffect: true
    },
    [Trait.gloomy]: {
        hasEffect: true
    },
    [Trait.houseHouston]: {

    },
    [Trait.houseMaddox]: {

    },
    [Trait.houseMonroe]: {

    }
};

export function getDefinition(trait: Trait): TraitDefinition {
    return all[trait];
}