import { Item, ItemDefinition, ItemType } from "./types";

type Prefix = "potion/";
const PREFIX = "potion/";
const itemType = ItemType.potion;
const basePath = "/img/items/deeds/";

export type PotionCategory = "health" | "soma" | "mana"
export interface PotionDefinition extends ItemDefinition {
    category: PotionCategory;
}

const potions = {
    minorHealth: {
        category: 'health',
        itemType,
        iconImg: `${basePath}minor-health.png`,
    },
    minorMana: {
        category: 'mana',
        itemType,
        iconImg: `${basePath}minor-mana.png`,
    },
    minorSoma: {
        category: 'soma',
        itemType,
        iconImg: `${basePath}minor-soma.png`,
    },
    lesserHealth: {
        category: 'health',
        itemType,
        iconImg: `${basePath}lesser-health.png`,
    },
    lesserMana: {
        category: 'mana',
        itemType,
        iconImg: `${basePath}lesser-mana.png`,
    },
    lesserSoma: {
        category: 'soma',
        itemType,
        iconImg: `${basePath}lesser-soma.png`,
    },
    majorHealth: {
        category: 'health',
        itemType,
        iconImg: `${basePath}major-health.png`,
    },
    majorMana: {
        category: 'mana',
        itemType,
        iconImg: `${basePath}major-mana.png`,
    },
    majorSoma: {
        category: 'soma',
        itemType,
        iconImg: `${basePath}major-soma.png`,
    },
    greaterHealth: {
        category: 'health',
        itemType,
        iconImg: `${basePath}greater-health.png`,
    },
    greaterMana: {
        category: 'mana',
        itemType,
        iconImg: `${basePath}greater-mana.png`,
    },
    greaterSoma: {
        category: 'soma',
        itemType,
        iconImg: `${basePath}greater-soma.png`,
    },
}

export type Potion = `${Prefix}${keyof typeof potions}`;
const all = Object.entries(potions).reduce<{[key: string]: PotionDefinition}>((acc, [key, value]) => {
    acc[`${PREFIX}${key}`] = value as PotionDefinition;
    return acc;    
}, {}) as Record<Potion, PotionDefinition>;
export default all;

export function getDefinition(potion: Potion): PotionDefinition {
    return all[potion];
}

export const isPotion = (item: Item): item is Potion => {
    return !!all[item as Potion];
}