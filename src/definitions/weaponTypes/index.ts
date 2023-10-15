import { WeaponAbility } from 'definitions/abilities/types'
import { WeaponClassification, WeaponType, type WeaponTypeDefinition } from './types'

export const all: { [key in WeaponType]: WeaponTypeDefinition } = {
  [WeaponType.axe]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.cut]
  },
  [WeaponType.bow]: {
    classification: WeaponClassification.ranged,
    abilities: [WeaponAbility.shoot]
  },
  [WeaponType.club]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry]
  },
  [WeaponType.crossbow]: {
    classification: WeaponClassification.ranged,
    abilities: [WeaponAbility.shoot]
  },
  [WeaponType.fist]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing]
  },
  [WeaponType.flail]: {
    classification: WeaponClassification.mainHand,
    abilities: [WeaponAbility.swing, WeaponAbility.parry]
  },
  [WeaponType.hammer]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry]
  },
  [WeaponType.knife]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.cut, WeaponAbility.parry]
  },
  [WeaponType.staff]: {
    classification: WeaponClassification.twoHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry]
  },
  [WeaponType.sword]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry]
  },
  [WeaponType.poleArm]: {
    classification: WeaponClassification.twoHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry]
  },
  [WeaponType.shield]: {
    classification: WeaponClassification.shield,
    abilities: [WeaponAbility.block]
  }
}

export const getDefinition = (weaponType: WeaponType): WeaponTypeDefinition => {
  return all[weaponType]
}
