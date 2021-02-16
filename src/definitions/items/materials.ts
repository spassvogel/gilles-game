import { Item, ItemDefinition, ItemType } from "./types";

type Prefix = "material/";
const PREFIX = "material/";
const itemType = ItemType.material;
const basePath = "/img/items/materials/";


const all = {
    arrowheads: {
        itemType,
        iconImg: `${basePath}arrowheads.png`,
    },
    bolts: {
        itemType,
        iconImg: `${basePath}bolts.png`,
    },
    buckle: {
        itemType,
        iconImg: `${basePath}buckle.png`,
    },
    chain: {
        itemType,
        iconImg: `${basePath}chain.png`,
    },
    cogs: {
        itemType,
        iconImg: `${basePath}cogs.png`,
    },
    gem: {
        itemType,
        iconImg: `${basePath}gem.png`,
    },
    gunpowder: {
        itemType,
        iconImg: `${basePath}gunpowder.png`,
    },
    ingot: {
        itemType,
        iconImg: `${basePath}ingot.png`,
    },
    nails: {
        itemType,
        iconImg: `${basePath}nails.png`,
    },
    poisonVial: {
        itemType,
        iconImg: `${basePath}poison-vial.png`,
    },
    ribbon: {
        itemType,
        iconImg: `${basePath}ribbon.png`,
    },
    rope: {
        itemType,
        iconImg: `${basePath}rope.png`,
    },
    scales: {
        itemType,
        iconImg: `${basePath}scales.png`,
    },
    spring: {
        itemType,
        iconImg: `${basePath}spring.png`,
    },
    thread: {
        itemType,
        iconImg: `${basePath}thread.png`,
    },
};


export default all;
export type Material = `${Prefix}${keyof typeof all}`;

export function getDefinition(material: Material): ItemDefinition {
    return all[material.substring((PREFIX).length) as keyof typeof all];
}

export const isMaterial = (item: Item): item is Material => {
    return item.substring(PREFIX.length) === PREFIX;
}