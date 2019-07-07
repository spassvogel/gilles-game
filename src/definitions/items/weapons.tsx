// tslint:disable:object-literal-sort-keys

import { Item, ItemDefinition, ItemType } from "./types";
const itemType = ItemType.equipment;

// tslint:disable-next-line:no-empty-interface
export interface EquipmentDefinition extends ItemDefinition {
}
export const crossbow: EquipmentDefinition = {
    item: Item.crossbow,
    itemType,
    subText: "Shoots and reloads fast",
    iconImg: "/img/equipment/crossbow.png",
};

export const longbow: EquipmentDefinition = {
    item: Item.longbow,
    itemType,
    subText: "A deadly killer from long range",
    iconImg: "/img/equipment/longbow.png",
};
export const dagger: EquipmentDefinition = {
    item: Item.dagger,
    itemType,
    subText: "Excellent for ritual sacrifice and cheese platters",
    iconImg: "/img/equipment/dagger.png",
};
export const poisonedDagger: EquipmentDefinition = {
    item: Item.poisonedDagger,
    itemType,
    subText: "Excellent for ritual sacrifice and cheese platters",
    iconImg: "/img/equipment/dagger.png",
};
export const sword: EquipmentDefinition = {
    item: Item.sword,
    itemType,
    subText: "An elegant weapon for a more civilized age",
    iconImg: "/img/equipment/sword.png",
};
export const khopesh: EquipmentDefinition = {
    item: Item.khopesh,
    itemType,
    subText: "Dafuq is this. Can I get garlic sauce with that?",
    iconImg: "/img/equipment/khopesh.png",
};

export const greatswordOfGwai: EquipmentDefinition = {
    item: Item.greatswordOfGwai,
    itemType,
    subText: "Finer steel was seldom forged",
    iconImg: "/img/equipment/sword.png",
    unique: true,
};

export const ironSword: EquipmentDefinition = {
    item: Item.ironSword,
    itemType,
    subText: "Finer steel was seldom forged",
    iconImg: "/img/equipment/sword.png",
};

export default {
    crossbow,
    ironSword,
    dagger,
    greatswordOfGwai,
    khopesh,
    longbow,
    poisonedDagger,
    sword,
};
