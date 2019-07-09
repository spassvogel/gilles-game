// tslint:disable:object-literal-sort-keys

import { Item, ItemDefinition, ItemType } from "./types";

const itemType = ItemType.trinket;
const basePath = "/img/items/quest-items/";

const questItemDefinitions: Record<string, ItemDefinition> = {
    [Item.crate]: {
        item: Item.crate,
        itemType,
        iconImg: `${basePath}crate.png`,
    },
    [Item.key]: {
        item: Item.key,
        itemType,
        iconImg: `${basePath}key.png`,
    },
    [Item.lockPicks]: {
        item: Item.lockPicks,
        itemType,
        iconImg: `${basePath}lock-picks.png`,
    },
    [Item.purpleGems]: {
        item: Item.purpleGems,
        itemType,
        iconImg: `${basePath}purple-gems.png`,
    },
    [Item.tooth]: {
        item: Item.tooth,
        itemType,
        iconImg: `${basePath}tooth.png`,
    },
    [Item.torch]: {
        item: Item.torch,
        itemType,
        iconImg: `${basePath}torch.png`,
    },
    [Item.tusk]: {
        item: Item.tusk,
        itemType,
        iconImg: `${basePath}tusk.png`,
    },
    [Item.vial]: {
        item: Item.vial,
        itemType,
        iconImg: `${basePath}vial.png`,
    },
    [Item.weeds]: {
        item: Item.weeds,
        itemType,
        iconImg: `${basePath}weeds.png`,
    },
};

export default questItemDefinitions;
