import { Item, ItemDefinition, ItemType } from "./types";

type Prefix = "mineral/";
const PREFIX = "mineral/";
const itemType = ItemType.mineral;
const basePath = "/img/items/minerals/";

// Minerals can be used to imbue magical powers to weapons and armor
const minerals = {
    amethyst: {
        itemType,
        iconImg: `${basePath}amethyst.png`,
    },
    aquamarine: {
        itemType,
        iconImg: `${basePath}aquamarine.png`,
    },
    arminsHeart: {
        itemType,
        iconImg: `${basePath}armins-heart.png`,
    },
    dragonsTooth: {
        itemType,
        iconImg: `${basePath}dragons-tooth.png`,
    },
    greenOpal: {
        itemType,
        iconImg: `${basePath}green-opal.png`,
    },
    jasper: {
        itemType,
        iconImg: `${basePath}jasper.png`,
    },
    malachite: {
        itemType,
        iconImg: `${basePath}malachite.png`,
    },
    moonstone: {
        itemType,
        iconImg: `${basePath}moonstone.png`,
    },
    obsidian: {
        itemType,
        iconImg: `${basePath}obsidian.png`,
    },
    roseQuartz: {
        itemType,
        iconImg: `${basePath}rose-quartz.png`,
    },
    sapphire: {
        itemType,
        iconImg: `${basePath}sapphire.png`,
    },
    spellstone: {
        itemType,
        iconImg: `${basePath}spellstone.png`,
    },
    tigersEye: {
        itemType,
        iconImg: `${basePath}tigers-eye.png`,
    },
    topaz: {
        itemType,
        iconImg: `${basePath}topaz.png`,
    },
    wyrdstone: {
        itemType,
        iconImg: `${basePath}wyrdstone.png`,
    },
};


export type Mineral = `${Prefix}${keyof typeof minerals}`;
const all = Object.entries(minerals).reduce<{[key: string]: ItemDefinition}>((acc, [key, value]) => {
    acc[`${PREFIX}${key}`] = value;
    return acc;    
}, {}) as Record<Mineral, ItemDefinition>;
export default all;

export function getDefinition(mineral: Mineral): ItemDefinition {
    return all[mineral];
}

export const isMineral = (item: Item): item is Mineral => {
    return !!all[item as Mineral];
}