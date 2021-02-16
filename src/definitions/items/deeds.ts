import { Structure } from "../structures";
import { Item, ItemDefinition, ItemType } from "./types";

type Prefix = "deed/";
const PREFIX = "deed/";
const itemType = ItemType.deed;
const basePath = "/img/items/deed/";

export interface DeedDefinition extends ItemDefinition {
    structure: Structure;
}

const all = {
    deedForLumbermill: {
        structure: Structure.lumberMill,
        itemType,
        iconImg: `${basePath}deed.png`,
    },
    deedForWeaponsmith: {
        structure: Structure.weaponsmith,
        itemType,
        iconImg: `${basePath}deed.png`,
    }
}

export default all;
export type Deed = `${Prefix}${keyof typeof all}`;

export function getDefinition(deed: Deed): DeedDefinition {
    return all[deed.substring((PREFIX).length) as keyof typeof all];
}

export const isDeed = (item: Item): item is Deed => {
    return item.substring(PREFIX.length) === PREFIX;
}