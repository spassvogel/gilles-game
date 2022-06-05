import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot';
import { Ammunition } from 'definitions/items/ammunition';
import { Apparel } from 'definitions/items/apparel';
import { Item } from 'definitions/items/types';
import { Weapon } from 'definitions/items/weapons';
import { Trait } from 'definitions/traits/types';
import { TempEffect } from 'definitions/tempEffects/types';
import { WeaponType } from 'definitions/weaponTypes/types';
import { sprites } from 'manifests/sprites';

export interface AdventurerStoreState {
  id: string;
  name?: string;
  flavor?: boolean;           // Has lore text, language key: `adventurer-{id}-flavor
  avatarImg: string;
  spritesheet: keyof typeof sprites;      // Path to JSON of spritesheet to use in scenes
  color?: AdventurerColor;
  traits?: Trait[];
  health: number;           // When this reaches zero, the adventurer is dead
  xp: number;

  equipment: EquipmentStoreState;   // equipment
  tempEffects: TempEffect[];          // combat effects
  inventory: (null | Item)[];
  basicAttributes: AttributesStoreState;
  skills: SkillsStoreState;       //
  room: number;             // Adventurer is lodged in this room in the tavern
}

export enum AdventurerColor {
  blue,
  red,
  teal,
  purple,
  orange,
  black,
  white,
  yellow,
}

export type Equipment = Apparel | Weapon | Ammunition;

export type EquipmentStoreState = {
  [EquipmentSlotType.head]?: Item<Apparel>;
  [EquipmentSlotType.shoulders]?: Item<Apparel>;
  [EquipmentSlotType.chest]?: Item<Apparel>;
  [EquipmentSlotType.hands]?: Item<Apparel>;
  [EquipmentSlotType.legs]?: Item<Apparel>;
  [EquipmentSlotType.feet]?: Item<Apparel>;
  [EquipmentSlotType.mainHand]?: Item<Weapon>;
  [EquipmentSlotType.offHand]?: Item<Weapon> | Item<Ammunition>;
};

export interface AttributesStoreState {
  str: number;
  for: number;
  int: number;
  agi: number;
}

// Determines the order in which the attributes are shown
export const attributeList: Attribute[] = ['str', 'for', 'int', 'agi'];

export type Attribute = keyof AttributesStoreState;

export type SkillsStoreState = {
  [key in WeaponType]?: number
};
