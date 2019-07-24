// tslint:disable:object-literal-sort-keys

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
    subText: "It allows for the construction of a lumber mill",
    iconImg: "/img/items/deeds/deed.png",
};

export const deedForWeaponsmith: DeedDefinition = {
    item: Item.deedForWeaponsmith,
    structure: Structure.weaponsmith,
    itemType,
    subText: "It allows for the construction of a weaponsmith",
    iconImg: "/img/items/deeds/deed.png",
};

export default {
    deedForLumbermill,
    deedForWeaponsmith,
};