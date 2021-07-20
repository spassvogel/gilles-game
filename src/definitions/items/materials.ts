import { Item, ItemDefinition, ItemType } from "./types";

type Prefix = "material/";
const PREFIX = "material/";
const itemType = ItemType.material;
const basePath = "/img/items/materials/";


const materials = {
    arrowheads: {
        itemType,
        iconImg: `${basePath}arrowheads.png`,
    },
    beam: {
        itemType,
        iconImg: `${basePath}beam.png`,
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
    pile: {
        itemType,
        iconImg: `${basePath}pile.png`,
    },
    planks: {
        itemType,
        iconImg: `${basePath}planks.png`,
    },
    poisonVial: {
        itemType,
        iconImg: `${basePath}poison-vial.png`,
    },
    pulley: {
        itemType,
        iconImg: `${basePath}pulley.png`,
    },
    ribbon: {
        itemType,
        iconImg: `${basePath}ribbon.png`,
    },
    rope: {
        itemType,
        iconImg: `${basePath}rope.png`,
    },
    runeCarvedPlank: {
        itemType,
        iconImg: `${basePath}rune-carved-plank.png`,
    },
    scales: {
        itemType,
        iconImg: `${basePath}scales.png`,
    },
    spring: {
        itemType,
        iconImg: `${basePath}spring.png`,
    },
    stake: {
        itemType,
        iconImg: `${basePath}stake.png`,
    },
    stick: {
        itemType,
        iconImg: `${basePath}stick.png`,
    },
    thread: {
        itemType,
        iconImg: `${basePath}thread.png`,
    },
    woodenMask: {
        itemType,
        iconImg: `${basePath}wooden-mask.png`,
    },
};


export type Material = `${Prefix}${keyof typeof materials}`;
const all = Object.entries(materials).reduce<{[key: string]: ItemDefinition}>((acc, [key, value]) => {
    acc[`${PREFIX}${key}`] = value;
    return acc;    
}, {}) as Record<Material, ItemDefinition>;
export default all;

export function getDefinition(material: Material): ItemDefinition {
    return all[material];
}

export const isMaterial = (item: Item): item is Material => {
    return !!all[item as Material];
}