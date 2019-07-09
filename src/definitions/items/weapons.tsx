// tslint:disable:object-literal-sort-keys

import { Item, ItemDefinition, ItemType } from "./types";

const itemType = ItemType.equipment; // todo: could be 'weapon'?
const basePath = "/img/items/weapons/";

// tslint:disable-next-line:no-empty-interface
export interface EquipmentDefinition extends ItemDefinition {}

const weaponDefinitions: Record<string, EquipmentDefinition> = {
    [Item.battleAxe]: {
        item: Item.battleAxe,
        itemType,
        subText: "It's an axe for battle",
        iconImg: `${basePath}battle_axe.png`,
    },
    [Item.brassKnuckles]: {
        item: Item.brassKnuckles,
        itemType,
        subText: " Brass knuckles are pieces of metal shaped to fit around the knuckles.",
        iconImg: `${basePath}brass_knuckles.png`,
    },
    [Item.crossbow]: {
        item: Item.crossbow,
        itemType,
        subText: "Shoots and reloads fast",
        iconImg: `${basePath}crossbow.png`,
    },
    [Item.cleaver]: {
        item: Item.cleaver,
        itemType,
        subText: "A cleaver is a large knife that varies in its shape but usually resembles a rectangular-bladed hatchet.",
        iconImg: `${basePath}cleaver.png`,
    },
    [Item.club]: {
        item: Item.club,
        itemType,
        subText: "A club is among the simplest of all weapons: a short staff or stick, usually made of wood, wielded as a weapon",
        iconImg: `${basePath}club.png`,
    },
    [Item.dagger]: {
        item: Item.dagger,
        itemType,
        subText: "Excellent for ritual sacrifice and cheese platters",
        iconImg: `${basePath}dagger.png`,
    },
    [Item.flail]: {
        item: Item.flail,
        itemType,
        subText: "A flail is a weapon consisting of a striking head attached to a handle by a flexible rope, strap, or chain. ",
        iconImg: `${basePath}flail.png`,
    },
    [Item.greatswordOfGwai]: {
        item: Item.greatswordOfGwai,
        itemType,
        subText: "Finer steel was seldom forged",
        iconImg: `${basePath}greatsword-gwai.png`,
        unique: true,
    },
    [Item.khopesh]: {
        item: Item.khopesh,
        itemType,
        subText: "Dafuq is this. Can I get garlic sauce with that?",
        iconImg: `${basePath}khopesh.png`,
    },
    [Item.longbow]: {
        item: Item.longbow,
        itemType,
        subText: "A deadly killer from long range",
        iconImg: `${basePath}longbow.png`,
    },
    [Item.mace]: {
        item: Item.mace,
        itemType,
        subText: "A mace is a blunt weapon, a type of club or virge that uses a heavy head on the end of a handle to deliver powerful blows.",
        iconImg: `${basePath}mace.png`,
    },
    [Item.morningStar]: {
        item: Item.morningStar,
        itemType,
        subText: "A morning star is any of several medieval club-like weapons consisting of a shaft with an attached ball adorned with one or more spikes.",
        iconImg: `${basePath}morning-star.png`,
    },
    [Item.poisonedDagger]: {
        item: Item.poisonedDagger,
        itemType,
        subText: "Excellent for ritual sacrifice and cheese platters",
        iconImg: `${basePath}poisoned-dagger.png`,
    },
    [Item.spear]: {
        item: Item.spear,
        itemType,
        subText: "A spear is a pole weapon consisting of a shaft, usually of wood, with a pointed head. ",
        iconImg: `${basePath}sword.png`,
    },
    [Item.sword]: {
        item: Item.sword,
        itemType,
        subText: "An elegant weapon for a more civilized age",
        iconImg: `${basePath}sword.png`,
    },
};
export default weaponDefinitions;
