import { Item, ItemDefinition, ItemType } from "./types";

type Prefix = "consumable/";
const PREFIX = "consumable/";
const itemType = ItemType.consumable;
const basePath = "/img/items/consumables/";

export type ConsumableCategory = "health" | "soma" | "mana"
export interface ConsumableDefinition extends ItemDefinition {
    category: ConsumableCategory;
}

const consumables = {
    minorHealthPotion: {
        category: 'health',
        itemType,
        iconImg: `${basePath}minor-health-potion.png`,
    },
    minorManaPotion: {
        category: 'mana',
        itemType,
        iconImg: `${basePath}minor-mana-potion.png`,
    },
    minorSoma: {
        category: 'soma',
        itemType,
        iconImg: `${basePath}minor-soma.png`,
    },
    lesserHealthPotion: {
        category: 'health',
        itemType,
        iconImg: `${basePath}lesser-health-potion.png`,
    },
    lesserManaPotion: {
        category: 'mana',
        itemType,
        iconImg: `${basePath}lesser-mana-potion.png`,
    },
    lesserSoma: {
        category: 'soma',
        itemType,
        iconImg: `${basePath}lesser-soma.png`,
    },
    majorHealthPotion: {
        category: 'health',
        itemType,
        iconImg: `${basePath}major-health-potion.png`,
    },
    majorManaPotion: {
        category: 'mana',
        itemType,
        iconImg: `${basePath}major-mana-potion.png`,
    },
    majorSoma: {
        category: 'soma',
        itemType,
        iconImg: `${basePath}major-soma.png`,
    },
    greaterHealthPotion: {
        category: 'health',
        itemType,
        iconImg: `${basePath}greater-health-potion.png`,
    },
    greaterManaPotion: {
        category: 'mana',
        itemType,
        iconImg: `${basePath}greater-mana-potion.png`,
    },
    greaterSoma: {
        category: 'soma',
        itemType,
        iconImg: `${basePath}greater-soma.png`,
    },
}

export type Consumable = `${Prefix}${keyof typeof consumables}`;
const all = Object.entries(consumables).reduce<{[key: string]: ConsumableDefinition}>((acc, [key, value]) => {
    acc[`${PREFIX}${key}`] = value as ConsumableDefinition;
    return acc;
}, {}) as Record<Consumable, ConsumableDefinition>;
export default all;

export function getDefinition(consumable: Consumable): ConsumableDefinition {
    return all[consumable];
}

export const isConsumable = (item: Item): item is Consumable => {
    return !!all[item as Consumable];
}
