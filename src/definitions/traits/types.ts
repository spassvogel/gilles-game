export type TraitDefinition = {
  trait: Trait
  hasEffect?: boolean // shown in tooltip
}

export enum Trait {
  arrowFinder = 'arrowFinder',
  gloomy = 'gloomy',
  lucky = 'lucky',
  houseHouston = 'houseHouston',
  houseMaddox = 'houseMaddox',
  houseMonroe = 'houseMonroe',
}
