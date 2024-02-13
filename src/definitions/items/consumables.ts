import { type ItemType, type ItemDefinition, ItemCategory } from './types'

type Prefix = 'consumable/'
const PREFIX = 'consumable/'
const itemCategory = ItemCategory.consumable
const basePath = '/img/items/consumables/'

export type ConsumableCategory = 'health' | 'rage' | 'soma' | 'mana'
export type ConsumableDefinition = {
  category: ConsumableCategory
  effect?: number
  charges?: number
} & ItemDefinition

const consumables = {
  minorHealthPotion: {
    category: 'health',
    effect: 10,
    itemCategory,
    iconImg: `${basePath}minor-health-potion.png`
  },
  minorManaPotion: {
    category: 'mana',
    itemCategory,
    iconImg: `${basePath}minor-mana-potion.png`
  },
  minorRagePotion: {
    category: 'rage',
    itemCategory,
    iconImg: `${basePath}minor-rage-potion.png`,
    effect: 1.5,
    charges: 2
  },
  minorSoma: {
    category: 'soma',
    itemCategory,
    iconImg: `${basePath}minor-soma.png`,
    effect: 1.1
  },
  lesserHealthPotion: {
    category: 'health',
    effect: 25,
    itemCategory,
    iconImg: `${basePath}lesser-health-potion.png`
  },
  lesserManaPotion: {
    category: 'mana',
    itemCategory,
    iconImg: `${basePath}lesser-mana-potion.png`
  },
  lesserRagePotion: {
    category: 'rage',
    itemCategory,
    iconImg: `${basePath}lesser-rage-potion.png`,
    effect: 2,
    charges: 2
  },
  lesserSoma: {
    category: 'soma',
    itemCategory,
    iconImg: `${basePath}lesser-soma.png`,
    effect: 1.25
  },
  majorHealthPotion: {
    category: 'health',
    effect: 50,
    itemCategory,
    iconImg: `${basePath}major-health-potion.png`
  },
  majorManaPotion: {
    category: 'mana',
    itemCategory,
    iconImg: `${basePath}major-mana-potion.png`
  },
  majorRagePotion: {
    category: 'rage',
    itemCategory,
    iconImg: `${basePath}major-rage-potion.png`,
    effect: 3,
    charges: 3
  },
  majorSoma: {
    category: 'soma',
    itemCategory,
    iconImg: `${basePath}major-soma.png`,
    effect: 1.5
  },
  greaterHealthPotion: {
    category: 'health',
    effect: 75,
    itemCategory,
    iconImg: `${basePath}greater-health-potion.png`
  },
  greaterManaPotion: {
    category: 'mana',
    itemCategory,
    iconImg: `${basePath}greater-mana-potion.png`
  },
  greaterRagePotion: {
    category: 'rage',
    itemCategory,
    iconImg: `${basePath}greater-rage-potion.png`,
    effect: 4,
    charges: 3
  },
  greaterSoma: {
    category: 'soma',
    itemCategory,
    iconImg: `${basePath}greater-soma.png`,
    effect: 2
  }
}

export type Consumable = `${Prefix}${keyof typeof consumables}`
const all = Object.entries(consumables).reduce<Record<string, ConsumableDefinition>>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value as ConsumableDefinition
  return acc
}, {}) as Record<Consumable, ConsumableDefinition>
export default all

export function getDefinition (consumable: Consumable): ConsumableDefinition {
  return all[consumable]
}

export const isConsumable = (item: ItemType): item is Consumable => {
  return all[item as Consumable] !== undefined
}
