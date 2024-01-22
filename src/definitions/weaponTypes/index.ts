import { WeaponAbility } from 'definitions/abilities/types'
import { WeaponClassification, WeaponType, type WeaponTypeDefinition } from './types'

export const all: { [key in WeaponType]: WeaponTypeDefinition } = {
  [WeaponType.axe]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.cut],
    crit: 0.3
  },
  [WeaponType.bow]: {
    classification: WeaponClassification.ranged,
    abilities: [WeaponAbility.shoot],
    crit: 0.1
  },
  [WeaponType.club]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
    crit: 0.1
  },
  [WeaponType.crossbow]: {
    classification: WeaponClassification.ranged,
    abilities: [WeaponAbility.shoot],
    crit: 0.1
  },
  [WeaponType.fist]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing],
    crit: 0.2
  },
  [WeaponType.flail]: {
    classification: WeaponClassification.mainHand,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
    crit: 0.3
  },
  [WeaponType.hammer]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
    crit: 0.2
  },
  [WeaponType.knife]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.cut, WeaponAbility.parry],
    crit: 0.3
  },
  [WeaponType.staff]: {
    classification: WeaponClassification.twoHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
    crit: 0.1
  },
  [WeaponType.sword]: {
    classification: WeaponClassification.oneHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
    crit: 0.2
  },
  [WeaponType.poleArm]: {
    classification: WeaponClassification.twoHanded,
    abilities: [WeaponAbility.swing, WeaponAbility.parry],
    crit: 0.1
  },
  [WeaponType.shield]: {
    classification: WeaponClassification.shield,
    abilities: [WeaponAbility.block]
  }
}

export const getDefinition = (weaponType: WeaponType): WeaponTypeDefinition => {
  return all[weaponType]
}
