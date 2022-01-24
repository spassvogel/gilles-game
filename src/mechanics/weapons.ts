import { WeaponAbility } from 'definitions/abilities/types';


export enum WeaponClassification {
  oneHanded,  // Can be used in main hand or off hand
  mainHand,   // Can only be used in main hand
  offHand,    // Can only be used in the off hand
  twoHanded,  // Can be used in the main hand and will disable off hand from being used
  shield,     // ?
  ranged,      // requires ammunition
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

export const WeaponTypeDefinition = {
  [WeaponType.axe]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.cut],
  },
  [WeaponType.bow]: {
    classification: WeaponClassification.ranged,
    abilities: [WeaponAbility.shoot],
  },
  [WeaponType.club]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
  },
  [WeaponType.crossbow]: {
    classification: WeaponClassification.ranged,
    abilities: [/*WeaponAbility.aimedShot,*/ WeaponAbility.shoot],
  },
  [WeaponType.fist]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing],
  },
  [WeaponType.flail]: {
    classification: WeaponClassification.mainHand,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
  },
  [WeaponType.hammer]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
  },
  [WeaponType.knife]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.cut, WeaponAbility.parry],
  },
  [WeaponType.staff]: {
    classification: WeaponClassification.twoHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
  },
  [WeaponType.sword]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
  },
  [WeaponType.poleArm]: {
    classification: WeaponClassification.twoHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
  },
  [WeaponType.shield]: {
    classification: WeaponClassification.shield,
    abilities: [WeaponAbility.block],
  },
};

export enum DamageType {
  kinetic = 'kinetic',
}

export interface DamageDefinition {
  [DamageType.kinetic]: number | undefined;
}
