// tslint:disable:object-literal-sort-keys

import { Item, ItemDefinition, ItemType } from "./types";

const itemType = ItemType.equipment; // todo: could be 'weapon'?
const basePath = "/img/items/equipment/";

// tslint:disable-next-line:no-empty-interface
export interface EquipmentDefinition extends ItemDefinition {}

const weaponDefinitions: Record<string, EquipmentDefinition> = {
    [Item.crossbow]: {
        item: Item.crossbow,
        itemType,
        subText: "Shoots and reloads fast",
        iconImg: `${basePath}crossbow.png`,
    },
    [Item.longbow]: {
        item: Item.longbow,
        itemType,
        subText: "A deadly killer from long range",
        iconImg: `${basePath}longbow.png`,
    },
    [Item.dagger]: {
        item: Item.dagger,
        itemType,
        subText: "Excellent for ritual sacrifice and cheese platters",
        iconImg: `${basePath}dagger.png`,
    },
    [Item.poisonedDagger]: {
        item: Item.poisonedDagger,
        itemType,
        subText: "Excellent for ritual sacrifice and cheese platters",
        iconImg: `${basePath}dagger.png`,
    },
    [Item.sword]: {
        item: Item.sword,
        itemType,
        subText: "An elegant weapon for a more civilized age",
        iconImg: `${basePath}sword.png`,
    },
    [Item.khopesh]: {
        item: Item.khopesh,
        itemType,
        subText: "Dafuq is this. Can I get garlic sauce with that?",
        iconImg: `${basePath}khopesh.png`,
    },
    [Item.greatswordOfGwai]: {
        item: Item.greatswordOfGwai,
        itemType,
        subText: "Finer steel was seldom forged",
        iconImg: `${basePath}sword.png`,
        unique: true,
    },
    [Item.ironSword]: {
        item: Item.ironSword,
        itemType,
        subText: "Finer steel was seldom forged",
        iconImg: `${basePath}sword.png`,
    },
    [Item.battleAxe]: {
        item: Item.battleAxe,
        itemType,
        subText: "It's an axe for battle",
        iconImg: `${basePath}battle_axe.png`,
    },
};
export default weaponDefinitions;
