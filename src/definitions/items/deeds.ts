import { Structure } from "../structures";
import { Item, ItemDefinition, ItemType } from "./types";

const itemType = ItemType.deed;

export interface DeedDefinition extends ItemDefinition {
    structure: Structure;
}

export const deedForLumbermill: DeedDefinition = {
    item: Item.deedForLumbermill,
    structure: Structure.lumberMill,
    itemType,
    iconImg: "/img/items/deeds/deed.png",
};

export const deedForWeaponsmith: DeedDefinition = {
    item: Item.deedForWeaponsmith,
    structure: Structure.weaponsmith,
    itemType,
    iconImg: "/img/items/deeds/deed.png",
};

const all = {
    deedForLumbermill,
    deedForWeaponsmith,
};


export default all;