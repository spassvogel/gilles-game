// tslint:disable:object-literal-sort-keys

import { Item, ItemDefinition } from "./types";
// tslint:disable-next-line:no-empty-interface
export interface EquipmentDefinition extends ItemDefinition {
}
export const crossbow: EquipmentDefinition = {
    item: Item.crossbow,
    name: "Crossbow",
    subText: "Shoots and reloads fast",
    iconImg: "/img/equipment/crossbow.png",
};

export const longbow: EquipmentDefinition = {
    item: Item.longbow,
    name: "Longbow",
    subText: "A deadly killer from long range",
    iconImg: "/img/equipment/longbow.png",
};
export const dagger: EquipmentDefinition = {
    item: Item.dagger,
    name: "Dagger",
    subText: "Excellent for ritual sacrifice and cheese platters",
    iconImg: "/img/equipment/dagger.png",
};
export const sword: EquipmentDefinition = {
    item: Item.sword,
    name: "Sword",
    subText: "An elegant weapon for a more civilized age",
    iconImg: "/img/equipment/sword.png",
};
export const khopesh: EquipmentDefinition = {
    item: Item.khopesh,
    name: "Khopesh",
    subText: "Dafuq is this. Can I get garlic sauce with that?",
    iconImg: "/img/equipment/khopesh.png",
};
