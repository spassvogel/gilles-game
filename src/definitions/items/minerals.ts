import { type ItemType, type ItemDefinition, ItemCategory } from './types'

type Prefix = 'mineral/'
const PREFIX = 'mineral/'
const itemCategory = ItemCategory.mineral
const basePath = '/img/items/minerals/'

// Minerals can be used to imbue magical powers to weapons and armor
const minerals = {
  amethyst: {
    itemCategory,
    iconImg: `${basePath}amethyst.png`
  },
  aquamarine: {
    itemCategory,
    iconImg: `${basePath}aquamarine.png`
  },
  arminsHeart: {
    itemCategory,
    iconImg: `${basePath}armins-heart.png`
  },
  dragonsTooth: {
    itemCategory,
    iconImg: `${basePath}dragons-tooth.png`
  },
  greenOpal: {
    itemCategory,
    iconImg: `${basePath}green-opal.png`
  },
  jasper: {
    itemCategory,
    iconImg: `${basePath}jasper.png`
  },
  malachite: {
    itemCategory,
    iconImg: `${basePath}malachite.png`
  },
  moonstone: {
    itemCategory,
    iconImg: `${basePath}moonstone.png`
  },
  obsidian: {
    itemCategory,
    iconImg: `${basePath}obsidian.png`
  },
  roseQuartz: {
    itemCategory,
    iconImg: `${basePath}rose-quartz.png`
  },
  sapphire: {
    itemCategory,
    iconImg: `${basePath}sapphire.png`
  },
  spellstone: {
    itemCategory,
    iconImg: `${basePath}spellstone.png`
  },
  tigersEye: {
    itemCategory,
    iconImg: `${basePath}tigers-eye.png`
  },
  topaz: {
    itemCategory,
    iconImg: `${basePath}topaz.png`
  },
  wyrdstone: {
    itemCategory,
    iconImg: `${basePath}wyrdstone.png`
  }
}

export type Mineral = `${Prefix}${keyof typeof minerals}`
const all = Object.entries(minerals).reduce<Record<string, ItemDefinition>>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value
  return acc
}, {}) as Record<Mineral, ItemDefinition>
export default all

export function getDefinition (mineral: Mineral): ItemDefinition {
  return all[mineral]
}

export const isMineral = (item: ItemType): item is Mineral => {
  return all[item as Mineral] !== undefined
}
