import { Item, ItemDefinition, ItemType } from "./types";

type Prefix = "herb/";
const PREFIX = "herb/";
const itemType = ItemType.herb;
const basePath = "/img/items/herbs/";

const herbs = {
    angelicasSorrow: {
        itemType,
        iconImg: `${basePath}angelicas-sorrow.png`,
    },
    bansheeReeds: {
        itemType,
        iconImg: `${basePath}banshee-reeds.png`,
    },
    blissflower: {
        itemType,
        iconImg: `${basePath}blissflower.png`,
    },
    bloodLotus: {
        itemType,
        iconImg: `${basePath}blood-lotus.png`,
    },
    bogroot: {
        itemType,
        iconImg: `${basePath}bogroot.png`,
    },
    ceviorise: {
        itemType,
        iconImg: `${basePath}ceviorise.png`,
    },
    chicory: {
        itemType,
        iconImg: `${basePath}chicory.png`,
    },
    dragonroot: {
        itemType,
        iconImg: `${basePath}dragonroot.png`,
    },
    heartsVine: {
        itemType,
        iconImg: `${basePath}hearts-vine.png`,
    },
    hyacinthus: {
        itemType,
        iconImg: `${basePath}hyacinthus.png`,
    },
    jaboticaba: {
        itemType,
        iconImg: `${basePath}jaboticaba.png`,
    },
    kingsrose: {
        itemType,
        iconImg: `${basePath}kingsrose.png`,
    },
    lastSupper: {
        itemType,
        iconImg: `${basePath}last-supper.png`,
    },
    mistagold: {
        itemType,
        iconImg: `${basePath}mistagold.png`,
    },
    monksweed: {
        itemType,
        iconImg: `${basePath}monksweed.png`,
    },
    moonFlower: {
        itemType,
        iconImg: `${basePath}moon-flower.png`,
    },
    mountainGrass: {
        itemType,
        iconImg: `${basePath}mountain-grass.png`,
    },
    oakLeaf: {
        itemType,
        iconImg: `${basePath}mountain-grass.png`,
    },
    patricksroot: {
        itemType,
        iconImg: `${basePath}patricksroot.png`,
    },
    sunleaf: {
        itemType,
        iconImg: `${basePath}sunleaf.png`,
    },
    trollsFeast: {
        itemType,
        iconImg: `${basePath}trolls-feast.png`,
    },
    uwolic: {
        itemType,
        iconImg: `${basePath}uwolic.png`,
    },
    wyrmvine: {
        itemType,
        iconImg: `${basePath}wyrmvine.png`,
    },
    winterWeed: {
        itemType,
        iconImg: `${basePath}winter-weed.png`,
    },
    wizardsBane: {
        itemType,
        iconImg: `${basePath}wizards-bane.png`,
    },
};

export type Herb = `${Prefix}${keyof typeof herbs}`;
const all = Object.entries(herbs).reduce<{[key: string]: ItemDefinition}>((acc, [key, value]) => {
    acc[`${PREFIX}${key}`] = value;
    return acc;    
}, {}) as Record<Herb, ItemDefinition>;
export default all;

export function getDefinition(herb: Herb): ItemDefinition {
    return all[herb];
}

export const isHerb = (item: Item): item is Herb => {
    return !!all[item as Herb];
}