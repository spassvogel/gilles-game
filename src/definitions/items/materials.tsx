// tslint:disable:object-literal-sort-keys

import { Item, ItemType } from "./types";

const itemType = ItemType.material;
export default {
    [Item.poisonVial]: {
        item: Item.poisonVial,
        itemType,
        iconImg: "/img/items/poison-vial.png",
    },
    [Item.jewel]: {
        item: Item.jewel,
        itemType,
        iconImg: "/img/items/gem.png",
    },
};
