import { Structure } from "../structures";
import { Item, ItemDefinition, ItemType } from "./types";

type Prefix = "deed/";
const PREFIX = "deed/";
const itemType = ItemType.deed;
const basePath = "/img/items/deeds/";

export interface DeedDefinition extends ItemDefinition {
    structure: Structure;
}

const deeds = {
    lumbermill: {
        structure: Structure.lumberMill,
        itemType,
        iconImg: `${basePath}deed.png`,
    },
    weaponsmith: {
        structure: Structure.weaponsmith,
        itemType,
        iconImg: `${basePath}deed.png`,
    }
}

export type Deed = `${Prefix}${keyof typeof deeds}`;
const all = Object.entries(deeds).reduce<{[key: string]: DeedDefinition}>((acc, [key, value]) => {
    acc[`${PREFIX}${key}`] = value;
    return acc;    
}, {}) as Record<Deed, DeedDefinition>;
export default all;

export function getDefinition(deed: Deed): DeedDefinition {
    return all[deed];
}

export const isDeed = (item: Item): item is Deed => {
    return !!all[item as Deed];
}