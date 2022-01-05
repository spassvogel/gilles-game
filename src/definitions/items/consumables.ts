import { ItemType, ItemDefinition, ItemCategory } from './types';

type Prefix = 'consumable/';
const PREFIX = 'consumable/';
const itemCategory = ItemCategory.consumable;
const basePath = '/img/items/consumables/';

export type ConsumableCategory = 'health' | 'soma' | 'mana';
export interface ConsumableDefinition extends ItemDefinition {
  category: ConsumableCategory;
  effect?: number;
}

const consumables = {
  minorHealthPotion: {
    category: 'health',
    effect: 10,
    itemCategory,
    iconImg: `${basePath}minor-health-potion.png`,
  },
  minorManaPotion: {
    category: 'mana',
    itemCategory,
    iconImg: `${basePath}minor-mana-potion.png`,
  },
  minorSoma: {
    category: 'soma',
    itemCategory,
    iconImg: `${basePath}minor-soma.png`,
    effect: 1.1,
  },
  lesserHealthPotion: {
    category: 'health',
    effect: 25,
    itemCategory,
    iconImg: `${basePath}lesser-health-potion.png`,
  },
  lesserManaPotion: {
    category: 'mana',
    itemCategory,
    iconImg: `${basePath}lesser-mana-potion.png`,
  },
  lesserSoma: {
    category: 'soma',
    itemCategory,
    iconImg: `${basePath}lesser-soma.png`,
    effect: 1.25,
  },
  majorHealthPotion: {
    category: 'health',
    effect: 50,
    itemCategory,
    iconImg: `${basePath}major-health-potion.png`,
  },
  majorManaPotion: {
    category: 'mana',
    itemCategory,
    iconImg: `${basePath}major-mana-potion.png`,
  },
  majorSoma: {
    category: 'soma',
    itemCategory,
    iconImg: `${basePath}major-soma.png`,
    effect: 1.5,
  },
  greaterHealthPotion: {
    category: 'health',
    effect: 75,
    itemCategory,
    iconImg: `${basePath}greater-health-potion.png`,
  },
  greaterManaPotion: {
    category: 'mana',
    itemCategory,
    iconImg: `${basePath}greater-mana-potion.png`,
  },
  greaterSoma: {
    category: 'soma',
    itemCategory,
    iconImg: `${basePath}greater-soma.png`,
    effect: 2,
  },
};

export type Consumable = `${Prefix}${keyof typeof consumables}`;
const all = Object.entries(consumables).reduce<{ [key: string]: ConsumableDefinition }>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value as ConsumableDefinition;
  return acc;
}, {}) as Record<Consumable, ConsumableDefinition>;
export default all;

export function getDefinition(consumable: Consumable): ConsumableDefinition {
  return all[consumable];
}

export const isConsumable = (item: ItemType): item is Consumable => {
  return !!all[item as Consumable];
};
