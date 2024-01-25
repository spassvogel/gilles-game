import { type WeaponAbility } from 'definitions/abilities/types'

export enum WeaponClassification {
  oneHanded, // Can be used in main hand or off hand
  mainHand, // Can only be used in main hand
  offHand, // Can only be used in the off hand
  twoHanded, // Can be used in the main hand and will disable off hand from being used
  shield, // ?
  ranged, // requires ammunition
}

export enum WeaponType {
  axe = 'axe',
  bow = 'bow',
  club = 'club',
  crossbow = 'crossbow',
  fist = 'fist',
  flail = 'flail',
  hammer = 'hammer',
  knife = 'knife',
  staff = 'staff',
  shield = 'shield',
  sword = 'sword',
  poleArm = 'poleArm',
}

export type WeaponTypeDefinition = {
  classification: WeaponClassification
  abilities: WeaponAbility[]
  crit?: number // number between 0 and 1, chance that an attack will result in a critical hit
}

export enum DamageType {
  kinetic = 'kinetic',
}

export type DamageDefinition = {
  [DamageType.kinetic]: number | undefined
}
