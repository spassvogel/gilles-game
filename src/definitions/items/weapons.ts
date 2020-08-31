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
    knife,
    staff,
    sword,
    poleArm,
    // shield ?
}

export enum WeaponClassification {
    oneHanded,  // Can be used in main hand or off hand
    mainHand,   // Can only be used in main hand
    offHand,    // Can only be used in the off hand
    twoHanded,  // Can be used in the main hand and will disable off hand from being used
    shield // ?
}

export const typeClassifications = {
    [WeaponType.axe]: WeaponClassification.oneHanded,
    [WeaponType.bow]: WeaponClassification.oneHanded,
    [WeaponType.club]: WeaponClassification.oneHanded,
    [WeaponType.crossbow]: WeaponClassification.mainHand,
    [WeaponType.fist]: WeaponClassification.oneHanded,
    [WeaponType.flail]: WeaponClassification.mainHand,
    [WeaponType.hammer]: WeaponClassification.oneHanded,
    [WeaponType.knife]: WeaponClassification.oneHanded,
    [WeaponType.staff]: WeaponClassification.twoHanded,
    [WeaponType.sword]: WeaponClassification.oneHanded,
    [WeaponType.poleArm]: WeaponClassification.twoHanded
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
        iconImg: `${basePath}arbalest.png`,
        damage: { [DamageType.kinetic]: 40 },
    },
    [Item.battleAxe]: {
        item: Item.battleAxe,
        itemType,
        weaponType: WeaponType.axe,
        iconImg: `${basePath}battle_axe.png`,
        damage: { [DamageType.kinetic]: 20 },
    },
    [Item.brassKnuckles]: {
        item: Item.brassKnuckles,
        itemType,
        weaponType: WeaponType.fist,
        iconImg: `${basePath}brass_knuckles.png`,
        damage: { [DamageType.kinetic]: 10 },
    },
    [Item.crossbow]: {
        item: Item.crossbow,
        itemType,
        weaponType: WeaponType.crossbow,
        iconImg: `${basePath}crossbow.png`,
        damage: { [DamageType.kinetic]: 3 },
    },
    [Item.cleaver]: {
        item: Item.cleaver,
        itemType,
        weaponType: WeaponType.knife,
        iconImg: `${basePath}cleaver.png`,
        damage: { [DamageType.kinetic]: 5 },
    },
    [Item.club]: {
        item: Item.club,
        itemType,
        weaponType: WeaponType.club,
        iconImg: `${basePath}club.png`,
        damage: { [DamageType.kinetic]: 8 },
    },
    [Item.dagger]: {
        item: Item.dagger,
        itemType,
        weaponType: WeaponType.knife,
        iconImg: `${basePath}dagger.png`,
        damage: { [DamageType.kinetic]: 8 },
    },
    [Item.flail]: {
        item: Item.flail,
        itemType,
        weaponType: WeaponType.flail,
        iconImg: `${basePath}flail.png`,
        damage: { [DamageType.kinetic]: 15 },
    },
    [Item.greatswordOfGwai]: {
        item: Item.greatswordOfGwai,
        itemType,
        weaponType: WeaponType.sword,
        iconImg: `${basePath}greatsword-gwai.png`,
        unique: true,
        damage: { [DamageType.kinetic]: 25 },
    },
    [Item.javelin]: {
        item: Item.javelin,
        itemType,
        weaponType: WeaponType.poleArm,
        iconImg: `${basePath}javelin.png`,
        damage: { [DamageType.kinetic]: 25 },
    },
    [Item.khopesh]: {
        item: Item.khopesh,
        itemType,
        weaponType: WeaponType.sword,
        iconImg: `${basePath}khopesh.png`,
        damage: { [DamageType.kinetic]: 15 },
    },
    [Item.longbow]: {
        item: Item.longbow,
        itemType,
        weaponType: WeaponType.bow,
        iconImg: `${basePath}longbow.png`,
        damage: { [DamageType.kinetic]: 2 },
    },
    [Item.mace]: {
        item: Item.mace,
        itemType,
        weaponType: WeaponType.club,
        iconImg: `${basePath}mace.png`,
        damage: { [DamageType.kinetic]: 15 },
    },
    [Item.morningStar]: {
        item: Item.morningStar,
        itemType,
        weaponType: WeaponType.club,
        iconImg: `${basePath}morning-star.png`,
        damage: { [DamageType.kinetic]: 13 },
    },
    [Item.poisonedDagger]: {
        item: Item.poisonedDagger,
        itemType,
        weaponType: WeaponType.knife,
        iconImg: `${basePath}poisoned-dagger.png`,
        damage: { [DamageType.kinetic]: 12 },
    },
    [Item.ravenStaff]: {
        item: Item.ravenStaff,
        itemType,
        weaponType: WeaponType.staff,
        iconImg: `${basePath}raven-staff.png`,
        damage: { [DamageType.kinetic]: 13 },
    },
    [Item.savageStaff]: {
        item: Item.savageStaff,
        itemType,
        weaponType: WeaponType.staff,
        iconImg: `${basePath}savage-staff.png`,
        damage: { [DamageType.kinetic]: 8 },
    },
    [Item.spear]: {
        item: Item.spear,
        itemType,
        weaponType: WeaponType.poleArm,
        iconImg: `${basePath}sword.png`,
        damage: { [DamageType.kinetic]: 10 },
    },
    [Item.sword]: {
        item: Item.sword,
        itemType,
        weaponType: WeaponType.sword,
        iconImg: `${basePath}sword.png`,
        damage: { [DamageType.kinetic]: 14 },
    },
    [Item.warhammer]: {
        item: Item.warhammer,
        itemType,
        weaponType: WeaponType.hammer,
        iconImg: `${basePath}warhammer.png`,
        damage: { [DamageType.kinetic]: 16 },
    },
};
export default weaponDefinitions;

export function getDefinition<T extends WeaponDefinition>(weapon: string): T {
    return weaponDefinitions[weapon] as T;
}
