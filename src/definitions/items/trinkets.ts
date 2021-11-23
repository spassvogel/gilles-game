import {  ItemType, ItemDefinition, ItemCategory } from "./types";

type Prefix = "trinket/";
const PREFIX = "trinket/";
const itemCategory = ItemCategory.trinket;
const basePath = "/img/items/trinkets/";

const trinkets = {
  magicAmulet: {
    itemCategory,
    iconImg: `${basePath}magic_amulet.png`,
  },
  ring: {
    itemCategory,
    iconImg: `${basePath}ring.png`,
  },
};


export type Trinket = `${Prefix}${keyof typeof trinkets}`;
const all = Object.entries(trinkets).reduce<{[key: string]: ItemDefinition}>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value;
  return acc;
}, {}) as Record<Trinket, ItemDefinition>;
export default all;

export function getDefinition(trinket: Trinket): ItemDefinition {
  return all[trinket];
}

export const isTrinket = (item: ItemType): item is Trinket => {
  return !!all[item as Trinket];
}
