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
    minorHealth: {
        category: 'health',
        itemType,
        iconImg: `${basePath}minor-health-potion.png`,
    },
    minorMana: {
        category: 'mana',
        itemType,
        iconImg: `${basePath}minor-mana-potion.png`,
    },
    minorSoma: {
        category: 'soma',
        itemType,
        iconImg: `${basePath}minor-soma.png`,
    },
    lesserHealth: {
        category: 'health',
        itemType,
        iconImg: `${basePath}lesser-health-potion.png`,
    },
    lesserMana: {
        category: 'mana',
        itemType,
        iconImg: `${basePath}lesser-mana-potion.png`,
    },
    lesserSoma: {
        category: 'soma',
        itemType,
        iconImg: `${basePath}lesser-soma.png`,
    },
    majorHealth: {
        category: 'health',
        itemType,
        iconImg: `${basePath}major-health-potion.png`,
    },
    majorMana: {
        category: 'mana',
        itemType,
        iconImg: `${basePath}major-mana-potion.png`,
    },
    majorSoma: {
        category: 'soma',
        itemType,
        iconImg: `${basePath}major-soma.png`,
    },
    greaterHealth: {
        category: 'health',
        itemType,
        iconImg: `${basePath}greater-health-potion.png`,
    },
    greaterMana: {
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