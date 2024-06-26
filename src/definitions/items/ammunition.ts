import { WeaponType } from 'definitions/weaponTypes/types'
import { type ItemType, type ItemDefinition, ItemCategory } from './types'

type Prefix = 'ammunition/'
const PREFIX = 'ammunition/'
const itemCategory = ItemCategory.ammunition
const basePath = 'img/items/ammunition/'

export type AmmunitionDefinition = {
  weaponType: WeaponType
} & ItemDefinition

const ammunitions = {
  armorPiercingArrows: {
    itemCategory,
    iconImg: `${basePath}armor-piercing-arrows.png`,
    weaponType: WeaponType.bow
  },
  basicArrows: {
    itemCategory,
    iconImg: `${basePath}basic-arrows.png`,
    weaponType: WeaponType.bow
  },
  crossbowBolts: {
    itemCategory,
    iconImg: `${basePath}crossbow-bolts.png`,
    weaponType: WeaponType.crossbow
  },
  elfenArrows: {
    itemCategory,
    iconImg: `${basePath}elfen-arrows.png`,
    weaponType: WeaponType.bow
  }
}

export type Ammunition = `${Prefix}${keyof typeof ammunitions}`
const all = Object.entries(ammunitions).reduce<Record<string, AmmunitionDefinition>>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value
  return acc
}, {}) as Record<Ammunition, AmmunitionDefinition>
export default all

export function getDefinition (ammunition: Ammunition): AmmunitionDefinition {
  return all[ammunition]
}

export const isAmmunition = (item: ItemType): item is Ammunition => {
  return all[item as Ammunition] !== undefined
}
