// tslint:disable:object-literal-sort-keys

import { Item, ItemDefinition, ItemType } from "./types";

const itemType = ItemType.questItem;
const basePath = "/img/items/quest-items/";

const questItemDefinitions: Record<string, ItemDefinition> = {
    [Item.blueprints]: {
        item: Item.blueprints,
        itemType,
        iconImg: `${basePath}blueprints.png`,
    },
    [Item.crate]: {
        item: Item.crate,
        itemType,
        iconImg: `${basePath}crate.png`,
    },
    [Item.dynamite]: {
        item: Item.dynamite,
        itemType,
        iconImg: `${basePath}dynamite.png`,
    },
    [Item.eye]: {
        item: Item.eye,
        itemType,
        iconImg: `${basePath}eye.png`,
    },
    [Item.feather]: {
        item: Item.feather,
        itemType,
        iconImg: `${basePath}feather.png`,
    },
    [Item.food]: {
        item: Item.food,
        itemType,
        iconImg: `${basePath}food.png`,
    },
    [Item.heart]: {
        item: Item.heart,
        itemType,
        iconImg: `${basePath}heart.png`,
    },
    [Item.horn]: {
        item: Item.horn,
        itemType,
        iconImg: `${basePath}horn.png`,
    },
    [Item.key]: {
        item: Item.key,
        itemType,
        iconImg: `${basePath}key.png`,
    },
    [Item.letters]: {
        item: Item.letters,
        itemType,
        iconImg: `${basePath}letters.png`,
    },
    [Item.lockPicks]: {
        item: Item.lockPicks,
        itemType,
        iconImg: `${basePath}lock-picks.png`,
    },
    [Item.oil]: {
        item: Item.oil,
        itemType,
        iconImg: `${basePath}oil.png`,
    },
    [Item.orcFinger]: {
        item: Item.orcFinger,
        itemType,
        iconImg: `${basePath}orc-finger.png`,
    },
    [Item.plans]: {
        item: Item.plans,
        itemType,
        iconImg: `${basePath}plans.png`,
    },
    [Item.purpleGems]: {
        item: Item.purpleGems,
        itemType,
        iconImg: `${basePath}purple-gems.png`,
    },
    [Item.runestone]: {
        item: Item.runestone,
        itemType,
        iconImg: `${basePath}runestone.png`,
    },
    [Item.teeth]: {
        item: Item.teeth,
        itemType,
        iconImg: `${basePath}teeth.png`,
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
    [Item.vase]: {
        item: Item.vase,
        itemType,
        iconImg: `${basePath}vase.png`,
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
