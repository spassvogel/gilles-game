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
    name: "Deed for a lumber mill",
    subText: "It allows for the construction of a lumber mill",
    iconImg: "/img/items/deed.png",
};
