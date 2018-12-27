// tslint:disable:object-literal-sort-keys

import { Structure } from "../structures";
import { Item, ItemDefinition } from "./types";

export interface DeedDefinition extends ItemDefinition {
    structure: Structure;
}
export const deedForLumbermill: DeedDefinition = {
    item: Item.deedForLumbermill,
    structure: Structure.lumberMill,
    name: "Deed for a lumber mill",
    subText: "It allows for the construction of a lumber mill",
    iconImg: "/img/items/deed.png",
};
