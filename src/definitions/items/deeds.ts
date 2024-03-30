import { type Structure } from '../structures'
import { type ItemType, type ItemDefinition, ItemCategory } from './types'

type Prefix = 'deed/'
const PREFIX = 'deed/'
const itemCategory = ItemCategory.deed
const basePath = '/img/items/deeds/'

export type DeedDefinition = {
  structure: Structure
} & ItemDefinition

const deeds = {
  alchemist: {
    structure: 'alchemist' as const,
    itemCategory,
    iconImg: `${basePath}deed.png`
  },
  armoursmith: {
    structure: 'armoursmith' as const,
    itemCategory,
    iconImg: `${basePath}deed.png`
  },
  lumbermill: {
    structure: 'lumberMill' as const,
    itemCategory,
    iconImg: `${basePath}deed.png`
  },
  mine: {
    structure: 'mine' as const,
    itemCategory,
    iconImg: `${basePath}deed.png`
  },
  tavern: {
    structure: 'tavern' as const,
    itemCategory,
    iconImg: `${basePath}deed.png`
  },
  weaponsmith: {
    structure: 'weaponsmith' as const,
    itemCategory,
    iconImg: `${basePath}deed.png`
  },
  workshop: {
    structure: 'workshop' as const,
    itemCategory,
    iconImg: `${basePath}deed.png`
  }
}

export type Deed = `${Prefix}${keyof typeof deeds}`
const all = Object.entries(deeds).reduce<Record<string, DeedDefinition>>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value
  return acc
}, {}) as Record<Deed, DeedDefinition>
export default all

export function getDefinition (deed: Deed): DeedDefinition {
  return all[deed] as unknown as DeedDefinition
}

export const isDeed = (item: ItemType): item is Deed => {
  return all[item as Deed] !== undefined
}
