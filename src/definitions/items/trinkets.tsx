// tslint:disable:object-literal-sort-keys

import { Item, ItemDefinition, ItemType } from "./types";

const itemType = ItemType.trinket;
const basePath = "/img/items/trinkets/";

const trinketDefinitions: Record<string, ItemDefinition> = {
    [Item.magicAmulet]: {
        item: Item.magicAmulet,
        itemType,
        iconImg: `${basePath}magic-amulet.png`,
    },
    [Item.ring]: {
        item: Item.ring,
        itemType,
        iconImg: `${basePath}ring.png`,
    },
};

export default trinketDefinitions;
