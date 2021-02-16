import {  Item, ItemDefinition, ItemType } from "./types";

type Prefix = "trinket/";
const PREFIX = "trinket/";
const itemType = ItemType.trinket;
const basePath = "/img/items/trinkets/";

const all = {
    magicAmulet: {
        itemType,
        iconImg: `${basePath}magic_amulet.png`,
    },
    ring: {
        itemType,
        iconImg: `${basePath}ring.png`,
    },
};



export default all;
export type Trinket = `${Prefix}${keyof typeof all}`;

export function getDefinition(trinket: Trinket): ItemDefinition {
    return all[trinket.substring((PREFIX).length) as keyof typeof all];
}

export const isTrinket = (item: Item): item is Trinket => {
    return item.substring(PREFIX.length) === PREFIX;
}