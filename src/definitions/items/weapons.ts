// tslint:disable:object-literal-sort-keys

import { Item, ItemDefinition, ItemType } from "./types";

const itemType = ItemType.weapon;
const basePath = "/img/items/weapons/";

export enum WeaponType {
    axe,
    bow,
    club,
    crossbow,
    fist,
    flail,
    hammer,
    melee,
    knife,
    staff,
    sword,
    poleArm,
}

export enum DamageType {
    kinetic = "kinetic",
}

export interface DamageDefinition {
    [DamageType.kinetic]: number | undefined;
}

// tslint:disable-next-line:no-empty-interface
export interface WeaponDefinition extends ItemDefinition {
    weaponType: WeaponType;
    damage: DamageDefinition;
}

const weaponDefinitions: Record<string, WeaponDefinition> = {
    [Item.arbalest]: {
        item: Item.arbalest,
        itemType,
        weaponType: WeaponType.crossbow,
        subText: "Larger and more powerful than a crossbow",
        iconImg: `${basePath}arbalest.png`,
        damage: { [DamageType.kinetic]: 40 },
    },
    [Item.battleAxe]: {
        item: Item.battleAxe,
        itemType,
        weaponType: WeaponType.axe,
        subText: "It's an axe for battle",
        iconImg: `${basePath}battle_axe.png`,
        damage: { [DamageType.kinetic]: 20 },
    },
    [Item.brassKnuckles]: {
        item: Item.brassKnuckles,
        itemType,
        weaponType: WeaponType.melee,
        subText: "Brass knuckles are pieces of metal shaped to fit around the knuckles.",
        iconImg: `${basePath}brass_knuckles.png`,
        damage: { [DamageType.kinetic]: 10 },
    },
    [Item.crossbow]: {
        item: Item.crossbow,
        itemType,
        weaponType: WeaponType.crossbow,
        subText: "Shoots and reloads fast",
        iconImg: `${basePath}crossbow.png`,
        damage: { [DamageType.kinetic]: 3 },
    },
    [Item.cleaver]: {
        item: Item.cleaver,
        itemType,
        weaponType: WeaponType.knife,
        subText: "A cleaver is a large knife that varies in its shape but usually resembles a rectangular-bladed hatchet.",
        iconImg: `${basePath}cleaver.png`,
        damage: { [DamageType.kinetic]: 5 },
    },
    [Item.club]: {
        item: Item.club,
        itemType,
        weaponType: WeaponType.club,
        subText: "A club is among the simplest of all weapons: a short staff or stick, usually made of wood, wielded as a weapon",
        iconImg: `${basePath}club.png`,
        damage: { [DamageType.kinetic]: 8 },
    },
    [Item.dagger]: {
        item: Item.dagger,
        itemType,
        weaponType: WeaponType.knife,
        subText: "Excellent for ritual sacrifice and cheese platters",
        iconImg: `${basePath}dagger.png`,
        damage: { [DamageType.kinetic]: 8 },
    },
    [Item.flail]: {
        item: Item.flail,
        itemType,
        weaponType: WeaponType.flail,
        subText: "A flail is a weapon consisting of a striking head attached to a handle by a flexible rope, strap, or chain. ",
        iconImg: `${basePath}flail.png`,
        damage: { [DamageType.kinetic]: 15 },
    },
    [Item.greatswordOfGwai]: {
        item: Item.greatswordOfGwai,
        itemType,
        weaponType: WeaponType.sword,
        subText: "Finer steel was seldom forged",
        iconImg: `${basePath}greatsword-gwai.png`,
        unique: true,
        damage: { [DamageType.kinetic]: 25 },
    },
    [Item.javelin]: {
        item: Item.javelin,
        itemType,
        weaponType: WeaponType.poleArm,
        subText: "A javelin is a light spear designed primarily to be thrown as a ranged weapon.",
        iconImg: `${basePath}javelin.png`,
        damage: { [DamageType.kinetic]: 25 },
    },
    [Item.khopesh]: {
        item: Item.khopesh,
        itemType,
        weaponType: WeaponType.sword,
        subText: "Dafuq is this. Can I get garlic sauce with that?",
        iconImg: `${basePath}khopesh.png`,
        damage: { [DamageType.kinetic]: 15 },
    },
    [Item.longbow]: {
        item: Item.longbow,
        itemType,
        weaponType: WeaponType.bow,
        subText: "A deadly killer from long range",
        iconImg: `${basePath}longbow.png`,
        damage: { [DamageType.kinetic]: 2 },
    },
    [Item.mace]: {
        item: Item.mace,
        itemType,
        weaponType: WeaponType.club,
        subText: "A mace is a blunt weapon, a type of club or virge that uses a heavy head on the end of a handle to deliver powerful blows.",
        iconImg: `${basePath}mace.png`,
        damage: { [DamageType.kinetic]: 15 },
    },
    [Item.morningStar]: {
        item: Item.morningStar,
        itemType,
        weaponType: WeaponType.club,
        subText: "A morning star is any of several medieval club-like weapons consisting of a shaft with an attached ball adorned with one or more spikes.",
        iconImg: `${basePath}morning-star.png`,
        damage: { [DamageType.kinetic]: 13 },
    },
    [Item.poisonedDagger]: {
        item: Item.poisonedDagger,
        itemType,
        weaponType: WeaponType.knife,
        subText: "Excellent for ritual sacrifice and cheese platters",
        iconImg: `${basePath}poisoned-dagger.png`,
        damage: { [DamageType.kinetic]: 12 },
    },
    [Item.ravenStaff]: {
        item: Item.ravenStaff,
        itemType,
        weaponType: WeaponType.staff,
        subText: "Kaa, kaa!",
        iconImg: `${basePath}raven-staff.png`,
        damage: { [DamageType.kinetic]: 13 },
    },
    [Item.savageStaff]: {
        item: Item.savageStaff,
        itemType,
        weaponType: WeaponType.staff,
        subText: "Savage dude",
        iconImg: `${basePath}savage-staff.png`,
        damage: { [DamageType.kinetic]: 8 },
    },
    [Item.spear]: {
        item: Item.spear,
        itemType,
        weaponType: WeaponType.poleArm,
        subText: "A spear is a pole weapon consisting of a shaft, usually of wood, with a pointed head. ",
        iconImg: `${basePath}sword.png`,
        damage: { [DamageType.kinetic]: 10 },
    },
    [Item.sword]: {
        item: Item.sword,
        itemType,
        weaponType: WeaponType.sword,
        subText: "An elegant weapon for a more civilized age",
        iconImg: `${basePath}sword.png`,
        damage: { [DamageType.kinetic]: 14 },
    },
    [Item.warhammer]: {
        item: Item.warhammer,
        itemType,
        weaponType: WeaponType.hammer,
        subText: "A war hammer is a late medieval weapon of war intended for close combat action, whose design resembles the hammer",
        iconImg: `${basePath}warhammer.png`,
        damage: { [DamageType.kinetic]: 16 },
    },
};
export default weaponDefinitions;

export function getDefinition<T extends WeaponDefinition>(weapon: string): T {
    return weaponDefinitions[weapon] as T;
}
