// tslint:disable:object-literal-sort-keys

import { Item, ItemType } from "./types";

const itemType = ItemType.material;
const basePath = "/img/items/materials/";

export default {
    [Item.poisonVial]: {
        item: Item.poisonVial,
        itemType,
        iconImg: `${basePath}poison-vial.png`,
    },
    [Item.jewel]: {
        item: Item.jewel,
        itemType,
        iconImg: `${basePath}gem.png`,
    },
};
