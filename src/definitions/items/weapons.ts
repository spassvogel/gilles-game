// tslint:disable:object-literal-sort-keys
import { Item, ItemDefinition, ItemType } from "./types";
import { Rarity } from 'constants/items';

const itemType = ItemType.weapon;
const basePath = "/img/items/weapons/";

export enum WeaponType {
    axe = "axe",
    bow = "bow",
    club = "club",
    crossbow = "crossbow",
    fist = "fist",
    flail = "flail",
    hammer = "hammer",
    knife = "knife",
    staff = "staff",
    shield = "shield",
    sword = "sword",
    poleArm = "poleArm",
}

export enum WeaponAbility {
    aimedShot,
    swing,
    block,
    cut,
    cleave,
    shoot,
    slash,
    parry,
}

export enum WeaponClassification {
    oneHanded,  // Can be used in main hand or off hand
    mainHand,   // Can only be used in main hand
    offHand,    // Can only be used in the off hand
    twoHanded,  // Can be used in the main hand and will disable off hand from being used
    shield      // ?
    // add 'ranged'?
}

export const WeaponTypeDefinition = {
    [WeaponType.axe]: {
        classification: WeaponClassification.oneHanded,
        abilities: [WeaponAbility.cut],
    },
    [WeaponType.bow]: {
        classification: WeaponClassification.oneHanded,
        abilities: [WeaponAbility.shoot]
    },
    [WeaponType.club]: {
        classification: WeaponClassification.oneHanded,
        abilities: [WeaponAbility.swing, WeaponAbility.parry]
    },
    [WeaponType.crossbow]: {
        classification: WeaponClassification.mainHand,
        abilities: [WeaponAbility.aimedShot, WeaponAbility.shoot]
    },
    [WeaponType.fist]: {
        classification: WeaponClassification.oneHanded,
        abilities: [WeaponAbility.swing]
    },
    [WeaponType.flail]: {
        classification: WeaponClassification.mainHand,
        abilities: [WeaponAbility.swing, WeaponAbility.parry]
    },
    [WeaponType.hammer]: {
        classification: WeaponClassification.oneHanded,
        abilities: [WeaponAbility.swing, WeaponAbility.parry]
    },
    [WeaponType.knife]: {
        classification: WeaponClassification.oneHanded,
        abilities: [WeaponAbility.cut, WeaponAbility.parry]
    },
    [WeaponType.staff]: {
        classification: WeaponClassification.twoHanded,
        abilities: [WeaponAbility.swing, WeaponAbility.parry]
    },
    [WeaponType.sword]: {
        classification: WeaponClassification.oneHanded,
        abilities: [WeaponAbility.swing, WeaponAbility.parry]
    },
    [WeaponType.poleArm]: {
        classification: WeaponClassification.twoHanded,
        abilities: [WeaponAbility.swing, WeaponAbility.parry]
    },
    [WeaponType.shield]: {
        classification: WeaponClassification.shield,
        abilities: [WeaponAbility.block]
    }
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
    damage?: DamageDefinition;
}

const weaponDefinitions: Record<string, WeaponDefinition> = {
    [Item.aegisOfValor]: {
        item: Item.aegisOfValor,
        itemType,
        weaponType: WeaponType.shield,
        rarity: Rarity.legendary,
        iconImg: `${basePath}aegis-of-valor.png`,
    },
    [Item.arbalest]: {
        item: Item.arbalest,
        itemType,
        weaponType: WeaponType.crossbow,
        rarity: Rarity.epic,
        iconImg: `${basePath}arbalest.png`,
        damage: { [DamageType.kinetic]: 40 },
    },
    [Item.battleAxe]: {
        item: Item.battleAxe,
        itemType,
        weaponType: WeaponType.axe,
        rarity: Rarity.common,
        iconImg: `${basePath}battle_axe.png`,
        damage: { [DamageType.kinetic]: 20 },
    },
    [Item.berserkerShield]: {
        item: Item.berserkerShield,
        itemType,
        weaponType: WeaponType.shield,
        rarity: Rarity.epic,
        iconImg: `${basePath}berserker-shield.png`,
    },
    [Item.brassKnuckles]: {
        item: Item.brassKnuckles,
        itemType,
        weaponType: WeaponType.fist,
        iconImg: `${basePath}brass_knuckles.png`,
        rarity: Rarity.common,
        damage: { [DamageType.kinetic]: 10 },
    },
    [Item.buckler]: {
        item: Item.buckler,
        itemType,
        weaponType: WeaponType.shield,
        rarity: Rarity.common,
        iconImg: `${basePath}buckler.png`,
    },
    [Item.cleaver]: {
        item: Item.cleaver,
        itemType,
        weaponType: WeaponType.knife,
        iconImg: `${basePath}cleaver.png`,
        rarity: Rarity.common,
        damage: { [DamageType.kinetic]: 5 },
    },
    [Item.club]: {
        item: Item.club,
        itemType,
        weaponType: WeaponType.club,
        iconImg: `${basePath}club.png`,
        rarity: Rarity.common,
        damage: { [DamageType.kinetic]: 8 },
    },
    [Item.dagger]: {
        item: Item.dagger,
        itemType,
        weaponType: WeaponType.knife,
        iconImg: `${basePath}dagger.png`,
        rarity: Rarity.uncommon,
        damage: { [DamageType.kinetic]: 8 },
    },
    [Item.flail]: {
        item: Item.flail,
        itemType,
        weaponType: WeaponType.flail,
        iconImg: `${basePath}flail.png`,
        rarity: Rarity.uncommon,
        damage: { [DamageType.kinetic]: 15 },
    },
    [Item.goldenShield]: {
        item: Item.goldenShield,
        itemType,
        weaponType: WeaponType.shield,
        rarity: Rarity.rare,
        iconImg: `${basePath}golden-shield.png`,
    },
    [Item.greatswordOfGwai]: {
        item: Item.greatswordOfGwai,
        itemType,
        weaponType: WeaponType.sword,
        iconImg: `${basePath}greatsword-gwai.png`,
        unique: true,
        rarity: Rarity.legendary,
        damage: { [DamageType.kinetic]: 25 },
    },
    [Item.indomitableCarapace]: {
        item: Item.indomitableCarapace,
        itemType,
        weaponType: WeaponType.shield,
        rarity: Rarity.epic,
        unique: true,
        iconImg: `${basePath}indomitable-carapace.png`,
    },
    [Item.javelin]: {
        item: Item.javelin,
        itemType,
        weaponType: WeaponType.poleArm,
        iconImg: `${basePath}javelin.png`,
        rarity: Rarity.epic,
        damage: { [DamageType.kinetic]: 25 },
    },
    [Item.khopesh]: {
        item: Item.khopesh,
        itemType,
        weaponType: WeaponType.sword,
        iconImg: `${basePath}khopesh.png`,
        rarity: Rarity.epic,
        damage: { [DamageType.kinetic]: 15 },
    },
    [Item.longbow]: {
        item: Item.longbow,
        itemType,
        weaponType: WeaponType.bow,
        iconImg: `${basePath}longbow.png`,
        rarity: Rarity.rare,
        damage: { [DamageType.kinetic]: 2 },
    },
    [Item.mace]: {
        item: Item.mace,
        itemType,
        weaponType: WeaponType.club,
        iconImg: `${basePath}mace.png`,
        rarity: Rarity.rare,
        damage: { [DamageType.kinetic]: 15 },
    },
    [Item.morningStar]: {
        item: Item.morningStar,
        itemType,
        weaponType: WeaponType.club,
        iconImg: `${basePath}morning-star.png`,
        rarity: Rarity.uncommon,
        damage: { [DamageType.kinetic]: 13 },
    },
    [Item.paintedBuckler]: {
        item: Item.paintedBuckler,
        itemType,
        weaponType: WeaponType.shield,
        iconImg: `${basePath}painted-buckler.png`,
    },
    [Item.poisonedDagger]: {
        item: Item.poisonedDagger,
        itemType,
        weaponType: WeaponType.knife,
        iconImg: `${basePath}poisoned-dagger.png`,
        rarity: Rarity.epic,
        damage: { [DamageType.kinetic]: 12 },
    },
    [Item.ravenStaff]: {
        item: Item.ravenStaff,
        itemType,
        weaponType: WeaponType.staff,
        iconImg: `${basePath}raven-staff.png`,
        rarity: Rarity.epic,
        damage: { [DamageType.kinetic]: 13 },
    },
    [Item.savageStaff]: {
        item: Item.savageStaff,
        itemType,
        weaponType: WeaponType.staff,
        iconImg: `${basePath}savage-staff.png`,
        rarity: Rarity.epic,
        damage: { [DamageType.kinetic]: 8 },
    },
    [Item.simpleCrossbow]: {
        item: Item.simpleCrossbow,
        itemType,
        weaponType: WeaponType.crossbow,
        iconImg: `${basePath}crossbow.png`,
        rarity: Rarity.common,
        damage: { [DamageType.kinetic]: 3 },
    },
    [Item.spear]: {
        item: Item.spear,
        itemType,
        weaponType: WeaponType.poleArm,
        iconImg: `${basePath}sword.png`,
        rarity: Rarity.rare,
        damage: { [DamageType.kinetic]: 10 },
    },
    [Item.steelShield]: {
        item: Item.steelShield,
        itemType,
        weaponType: WeaponType.shield,
        rarity: Rarity.rare,
        iconImg: `${basePath}steel-shield.png`,
    },
    [Item.sword]: {
        item: Item.sword,
        itemType,
        weaponType: WeaponType.sword,
        iconImg: `${basePath}sword.png`,
        rarity: Rarity.uncommon,
        damage: { [DamageType.kinetic]: 14 },
    },
    [Item.warhammer]: {
        item: Item.warhammer,
        itemType,
        weaponType: WeaponType.hammer,
        iconImg: `${basePath}warhammer.png`,
        rarity: Rarity.rare,
        damage: { [DamageType.kinetic]: 16 },
    },
    [Item.woodenBulwark]: {
        item: Item.woodenBulwark,
        itemType,
        weaponType: WeaponType.shield,
        rarity: Rarity.common,
        iconImg: `${basePath}wooden-bulwark.png`,
    },
};
export default weaponDefinitions;

export function getDefinition<T extends WeaponDefinition>(weapon: string): T {
    return weaponDefinitions[weapon] as T;
}
