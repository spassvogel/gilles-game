import { ItemType, ItemDefinition, ItemCategory } from "./types";
import { Rarity } from 'constants/items';

type Prefix = "weapon/";
const PREFIX = "weapon/";
const itemCategory = ItemCategory.weapon;
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
  offHand,  // Can only be used in the off hand
  twoHanded,  // Can be used in the main hand and will disable off hand from being used
  shield    // ?
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


export interface WeaponDefinition extends ItemDefinition {
  weaponType: WeaponType;
  damage?: DamageDefinition;
}

const weapons = {
  aegisOfValor: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.legendary,
    iconImg: `${basePath}aegis-of-valor.png`,
  },
  arbalest: {
    itemCategory,
    weaponType: WeaponType.crossbow,
    rarity: Rarity.epic,
    iconImg: `${basePath}arbalest.png`,
    damage: { [DamageType.kinetic]: 40 },
  },
  battleAxe: {
    itemCategory,
    weaponType: WeaponType.axe,
    rarity: Rarity.common,
    iconImg: `${basePath}battle-axe.png`,
    damage: { [DamageType.kinetic]: 20 },
  },
  berserkerShield: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.epic,
    iconImg: `${basePath}berserker-shield.png`,
  },
  brassKnuckles: {
    itemCategory,
    weaponType: WeaponType.fist,
    iconImg: `${basePath}brass-knuckles.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 10 },
  },
  bronzeDagger: {
    itemCategory,
    weaponType: WeaponType.knife,
    iconImg: `${basePath}bronze-dagger.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 8 },
  },
  buckler: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.common,
    iconImg: `${basePath}buckler.png`,
  },
  cleaver: {
    itemCategory,
    weaponType: WeaponType.knife,
    iconImg: `${basePath}cleaver.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 5 },
  },
  club: {
    itemCategory,
    weaponType: WeaponType.club,
    iconImg: `${basePath}club.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 8 },
  },
  dagger: {
    itemCategory,
    weaponType: WeaponType.knife,
    iconImg: `${basePath}dagger.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 10 },
  },
  dirk: {
    itemCategory,
    weaponType: WeaponType.knife,
    iconImg: `${basePath}dirk.png`,
    rarity: Rarity.uncommon,
    damage: { [DamageType.kinetic]: 10 },
  },
  falchion: {
    itemCategory,
    weaponType: WeaponType.sword,
    iconImg: `${basePath}falchion.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 12 },
  },
  flail: {
    itemCategory,
    weaponType: WeaponType.flail,
    iconImg: `${basePath}flail.png`,
    rarity: Rarity.uncommon,
    damage: { [DamageType.kinetic]: 15 },
  },
  goldenShield: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.rare,
    iconImg: `${basePath}golden-shield.png`,
  },
  greatswordOfGwai: {
    itemCategory,
    weaponType: WeaponType.sword,
    iconImg: `${basePath}greatsword-gwai.png`,
    unique: true,
    rarity: Rarity.legendary,
    damage: { [DamageType.kinetic]: 25 },
  },
  halbert: {
    itemCategory,
    weaponType: WeaponType.poleArm,
    iconImg: `${basePath}halbert.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 12 },
  },
  huntingBow: {
    itemCategory,
    weaponType: WeaponType.bow,
    iconImg: `${basePath}hunting-bow.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 3 },
  },
  indomitableCarapace: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.epic,
    unique: true,
    iconImg: `${basePath}indomitable-carapace.png`,
  },
  jaggedBlade: {
    itemCategory,
    weaponType: WeaponType.knife,
    rarity: Rarity.epic,
    iconImg: `${basePath}jagged-blade.png`,
  },
  javelin: {
    itemCategory,
    weaponType: WeaponType.poleArm,
    iconImg: `${basePath}javelin.png`,
    rarity: Rarity.epic,
    damage: { [DamageType.kinetic]: 25 },
  },
  khopesh: {
    itemCategory,
    weaponType: WeaponType.sword,
    iconImg: `${basePath}khopesh.png`,
    rarity: Rarity.epic,
    damage: { [DamageType.kinetic]: 15 },
  },
  legionnaireSword: {
    itemCategory,
    weaponType: WeaponType.sword,
    iconImg: `${basePath}legionnaire-sword.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 8 },
  },
  longbow: {
    itemCategory,
    weaponType: WeaponType.bow,
    iconImg: `${basePath}longbow.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 2 },
  },
  mace: {
    itemCategory,
    weaponType: WeaponType.club,
    iconImg: `${basePath}mace.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 15 },
  },
  morningStar: {
    itemCategory,
    weaponType: WeaponType.club,
    iconImg: `${basePath}morning-star.png`,
    rarity: Rarity.uncommon,
    damage: { [DamageType.kinetic]: 13 },
  },
  paintedBuckler: {
    itemCategory,
    weaponType: WeaponType.shield,
    iconImg: `${basePath}painted-buckler.png`,
  },
  poisonedDagger: {
    itemCategory,
    weaponType: WeaponType.knife,
    iconImg: `${basePath}poisoned-dagger.png`,
    rarity: Rarity.epic,
    damage: { [DamageType.kinetic]: 12 },
  },
  pikeStaff: {
    itemCategory,
    weaponType: WeaponType.poleArm,
    iconImg: `${basePath}pike-staff.png`,
    rarity: Rarity.uncommon,
    damage: { [DamageType.kinetic]: 22 },
  },
  ravenStaff: {
    itemCategory,
    weaponType: WeaponType.staff,
    iconImg: `${basePath}raven-staff.png`,
    rarity: Rarity.epic,
    damage: { [DamageType.kinetic]: 13 },
  },
  scythe: {
    itemCategory,
    weaponType: WeaponType.poleArm,
    iconImg: `${basePath}scythe.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 5 },
  },
  savageStaff: {
    itemCategory,
    weaponType: WeaponType.staff,
    iconImg: `${basePath}savage-staff.png`,
    rarity: Rarity.epic,
    damage: { [DamageType.kinetic]: 8 },
  },
  simpleCrossbow: {
    itemCategory,
    weaponType: WeaponType.crossbow,
    iconImg: `${basePath}crossbow.png`,
    rarity: Rarity.common,
    damage: { [DamageType.kinetic]: 3 },
  },
  spear: {
    itemCategory,
    weaponType: WeaponType.poleArm,
    iconImg: `${basePath}spear.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 10 },
  },
  steelShield: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.rare,
    iconImg: `${basePath}steel-shield.png`,
  },
  steelSword: {
    itemCategory,
    weaponType: WeaponType.sword,
    iconImg: `${basePath}steel-sword.png`,
    rarity: Rarity.uncommon,
    damage: { [DamageType.kinetic]: 14 },
  },
  warhammer: {
    itemCategory,
    weaponType: WeaponType.hammer,
    iconImg: `${basePath}warhammer.png`,
    rarity: Rarity.rare,
    damage: { [DamageType.kinetic]: 16 },
  },
  woodenBulwark: {
    itemCategory,
    weaponType: WeaponType.shield,
    rarity: Rarity.common,
    iconImg: `${basePath}wooden-bulwark.png`,
  },
};


export type Weapon = `${Prefix}${keyof typeof weapons}`;
const all = Object.entries(weapons).reduce<{[key: string]: WeaponDefinition}>((acc, [key, value]) => {
  acc[`${PREFIX}${key}`] = value;
  return acc;
}, {}) as Record<Weapon, WeaponDefinition>;
export default all;

export function getDefinition(weapon: Weapon): WeaponDefinition {
  return all[weapon];
}

export const isWeapon = (item: ItemType): item is Weapon => {
  return !!all[item as Weapon];
}
