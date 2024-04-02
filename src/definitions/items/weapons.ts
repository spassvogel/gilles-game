import { type ItemType, type ItemDefinition, ItemCategory } from './types'
import { Rarity } from 'constants/items'
import { type Effect, type EffectAttibuteIncrease, EffectType } from 'definitions/effects/types'
import { WeaponType, type DamageDefinition, DamageType } from 'definitions/weaponTypes/types'

type Prefix = 'weapon/'
const PREFIX = 'weapon/'
const itemCategory = ItemCategory.weapon
const basePath = 'img/items/weapons/'

export type WeaponDefinition = {
  weaponType: WeaponType
  damage?: DamageDefinition
  effects?: Effect[]
} & ItemDefinition

const weapons = {
  aegisOfValor: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.legendary,
    iconImg: `${basePath}aegis-of-valor.png`
  },
  arbalest: {
    itemCategory,
    weaponType: WeaponType.crossbow,
    rarity: Rarity.epic,
    iconImg: `${basePath}arbalest.png`,
    damage: { [DamageType.kinetic]: 40 }
  },
  battleAxe: {
    itemCategory,
    weaponType: WeaponType.axe,
    rarity: Rarity.common,
    iconImg: `${basePath}battle-axe.png`,
    damage: { [DamageType.kinetic]: 20 }
  },
  boneBow: {
    itemCategory,
    weaponType: WeaponType.bow,
    rarity: Rarity.common,
    iconImg: `${basePath}bone-bow.png`,
    damage: { [DamageType.kinetic]: 15 }
  },
  berserkerShield: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.epic,
    iconImg: `${basePath}berserker-shield.png`
  },
  brassKnuckles: {
    itemCategory,
    weaponType: WeaponType.fist,
    iconImg: `${basePath}brass-knuckles.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 10 }
  },
  bronzeDagger: {
    itemCategory,
    weaponType: WeaponType.knife,
    iconImg: `${basePath}bronze-dagger.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 8 }
  },
  buckler: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.common,
    iconImg: `${basePath}buckler.png`
  },
  cleaver: {
    itemCategory,
    weaponType: WeaponType.knife,
    iconImg: `${basePath}cleaver.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 5 }
  },
  club: {
    itemCategory,
    weaponType: WeaponType.club,
    iconImg: `${basePath}club.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 8 }
  },
  dagger: {
    itemCategory,
    weaponType: WeaponType.knife,
    iconImg: `${basePath}dagger.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 10 }
  },
  dirk: {
    itemCategory,
    weaponType: WeaponType.knife,
    iconImg: `${basePath}dirk.png`,
    rarity: Rarity.uncommon,
    damage: { [DamageType.kinetic]: 10 }
  },
  falchion: {
    itemCategory,
    weaponType: WeaponType.sword,
    iconImg: `${basePath}falchion.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 12 }
  },
  flail: {
    itemCategory,
    weaponType: WeaponType.flail,
    iconImg: `${basePath}flail.png`,
    rarity: Rarity.uncommon,
    damage: { [DamageType.kinetic]: 15 }
  },
  goldenShield: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.rare,
    iconImg: `${basePath}golden-shield.png`
  },
  greatswordOfGwai: {
    itemCategory,
    weaponType: WeaponType.sword,
    iconImg: `${basePath}greatsword-gwai.png`,
    unique: true,
    rarity: Rarity.legendary,
    damage: { [DamageType.kinetic]: 25 },
    effects: [{
      type: EffectType.attributeIncrease,
      attribute: 'agi',
      factor: 1.1
    }, {
      type: EffectType.attributeIncrease,
      attribute: 'for',
      factor: 1.1
    }, {
      type: EffectType.attributeIncrease,
      attribute: 'int',
      factor: 1.1
    }, {
      type: EffectType.attributeIncrease,
      attribute: 'str',
      factor: 1.1
    }] as EffectAttibuteIncrease[]
  },
  halbert: {
    itemCategory,
    weaponType: WeaponType.poleArm,
    iconImg: `${basePath}halbert.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 12 }
  },
  huntingBow: {
    itemCategory,
    weaponType: WeaponType.bow,
    iconImg: `${basePath}hunting-bow.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 5 }
  },
  indomitableCarapace: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.epic,
    unique: true,
    iconImg: `${basePath}indomitable-carapace.png`
  },
  jaggedBlade: {
    itemCategory,
    weaponType: WeaponType.knife,
    rarity: Rarity.epic,
    iconImg: `${basePath}jagged-blade.png`
  },
  javelin: {
    itemCategory,
    weaponType: WeaponType.poleArm,
    iconImg: `${basePath}javelin.png`,
    rarity: Rarity.epic,
    damage: { [DamageType.kinetic]: 25 }
  },
  khopesh: {
    itemCategory,
    weaponType: WeaponType.sword,
    iconImg: `${basePath}khopesh.png`,
    rarity: Rarity.epic,
    damage: { [DamageType.kinetic]: 15 }
  },
  legionnaireSword: {
    itemCategory,
    weaponType: WeaponType.sword,
    iconImg: `${basePath}legionnaire-sword.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 8 }
  },
  longbow: {
    itemCategory,
    weaponType: WeaponType.bow,
    iconImg: `${basePath}longbow.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 6 }
  },
  mace: {
    itemCategory,
    weaponType: WeaponType.club,
    iconImg: `${basePath}mace.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 15 }
  },
  morningStar: {
    itemCategory,
    weaponType: WeaponType.club,
    iconImg: `${basePath}morning-star.png`,
    rarity: Rarity.uncommon,
    damage: { [DamageType.kinetic]: 13 }
  },
  oakWoodBow: {
    itemCategory,
    weaponType: WeaponType.bow,
    iconImg: `${basePath}oakwood-bow.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 23 }
  },
  paintedBuckler: {
    itemCategory,
    weaponType: WeaponType.shield,
    iconImg: `${basePath}painted-buckler.png`
  },
  poisonedDagger: {
    itemCategory,
    weaponType: WeaponType.knife,
    iconImg: `${basePath}poisoned-dagger.png`,
    rarity: Rarity.epic,
    damage: { [DamageType.kinetic]: 12 }
  },
  pikeStaff: {
    itemCategory,
    weaponType: WeaponType.poleArm,
    iconImg: `${basePath}pike-staff.png`,
    rarity: Rarity.uncommon,
    damage: { [DamageType.kinetic]: 22 }
  },
  ravenStaff: {
    itemCategory,
    weaponType: WeaponType.staff,
    iconImg: `${basePath}raven-staff.png`,
    rarity: Rarity.epic,
    damage: { [DamageType.kinetic]: 13 }
  },
  scythe: {
    itemCategory,
    weaponType: WeaponType.poleArm,
    iconImg: `${basePath}scythe.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 5 }
  },
  savageStaff: {
    itemCategory,
    weaponType: WeaponType.staff,
    iconImg: `${basePath}savage-staff.png`,
    rarity: Rarity.epic,
    damage: { [DamageType.kinetic]: 8 }
  },
  simpleCrossbow: {
    itemCategory,
    weaponType: WeaponType.crossbow,
    iconImg: `${basePath}crossbow.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 5 }
  },
  spear: {
    itemCategory,
    weaponType: WeaponType.poleArm,
    iconImg: `${basePath}spear.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 10 }
  },
  steelShield: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.rare,
    iconImg: `${basePath}steel-shield.png`
  },
  steelSword: {
    itemCategory,
    weaponType: WeaponType.sword,
    iconImg: `${basePath}steel-sword.png`,
    rarity: Rarity.uncommon,
    damage: { [DamageType.kinetic]: 14 }
  },
  warhammer: {
    itemCategory,
    weaponType: WeaponType.hammer,
    iconImg: `${basePath}warhammer.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 16 }
  },
  woodenBulwark: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.common,
    iconImg: `${basePath}wooden-bulwark.png`
  }
}

export type Weapon = `${Prefix}${keyof typeof weapons}`
const all = Object.entries(weapons).reduce<Record<string, WeaponDefinition>>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value
  return acc
}, {}) as Record<Weapon, WeaponDefinition>
export default all

export function getDefinition (weapon: Weapon): WeaponDefinition {
  return all[weapon]
}

export const isWeapon = (item: ItemType): item is Weapon => {
  return all[item as Weapon] !== undefined
}
