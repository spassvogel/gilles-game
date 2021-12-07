export interface TraitDefinition {
  trait: Trait;
  hasEffect?: boolean;    // shown in tooltip
}

export enum Trait {
  arrowFinder = "arrowFinder",
  gloomy = "gloomy",
  houseHouston = "houseHouston",
  houseMaddox = "houseMaddox",
  houseMonroe = "houseMonroe",
}

