// tslint:disable:object-literal-sort-keys

import { Item, ItemDefinition, ItemType } from "./types";
const itemType = ItemType.equipment; // todo: could be 'weapon'?

// tslint:disable-next-line:no-empty-interface
export interface EquipmentDefinition extends ItemDefinition {
}

const weaponDefinitions: Record<string, EquipmentDefinition> = {
    [Item.crossbow]: {
        item: Item.crossbow,
        itemType,
        subText: "Shoots and reloads fast",
        iconImg: "/img/equipment/crossbow.png",
    },
    [Item.longbow]: {
        item: Item.longbow,
        itemType,
        subText: "A deadly killer from long range",
        iconImg: "/img/equipment/longbow.png",
    },
    [Item.dagger]: {
        item: Item.dagger,
        itemType,
        subText: "Excellent for ritual sacrifice and cheese platters",
        iconImg: "/img/equipment/dagger.png",
    },
    [Item.poisonedDagger]: {
        item: Item.poisonedDagger,
        itemType,
        subText: "Excellent for ritual sacrifice and cheese platters",
        iconImg: "/img/equipment/dagger.png",
    },
    [Item.sword]: {
        item: Item.sword,
        itemType,
        subText: "An elegant weapon for a more civilized age",
        iconImg: "/img/equipment/sword.png",
    },
    [Item.khopesh]: {
        item: Item.khopesh,
        itemType,
        subText: "Dafuq is this. Can I get garlic sauce with that?",
        iconImg: "/img/equipment/khopesh.png",
    },
    [Item.greatswordOfGwai]: {
        item: Item.greatswordOfGwai,
        itemType,
        subText: "Finer steel was seldom forged",
        iconImg: "/img/equipment/sword.png",
        unique: true,
    },
    [Item.ironSword]: {
        item: Item.ironSword,
        itemType,
        subText: "Finer steel was seldom forged",
        iconImg: "/img/equipment/sword.png",
    },
    [Item.battleAxe]: {
        item: Item.battleAxe,
        itemType,
        subText: "It's an axe for battle",
        iconImg: "/img/equipment/battle_axe.png",
    },
};
export default weaponDefinitions;
