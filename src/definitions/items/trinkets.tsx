// tslint:disable:object-literal-sort-keys

import { Item, ItemDefinition, ItemType } from "./types";

const itemType = ItemType.equipment;

export const magicAmulet: ItemDefinition = {
    item: Item.magicAmulet,
    itemType,
    name: "item-magic-amulet",
    iconImg: "/img/items/deed.png",
};

export default {
    magicAmulet,
};
