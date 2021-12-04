import { EquipmentSlotType } from "components/ui/adventurer/EquipmentSlot";
import { Ammunition } from "definitions/items/ammunition";
import { Apparel } from "definitions/items/apparel";
import { Item } from "definitions/items/types";
import { Weapon, WeaponType } from "definitions/items/weapons";
import { Trait } from 'definitions/traits/types';
import { Effect } from "mechanics/effects/types";

export interface AdventurerStoreState {
  id: string;
  name?: string;
  flavor?: boolean;           // Has lore text, language key: `adventurer-{id}-flavor
  avatarImg: string;
  spritesheetPath: string;      // Path to JSON of spritesheet to use in scenes
  color?: AdventurerColor;
  traits?: Trait[];
  health: number;           // When this reaches zero, the adventurer is dead
  xp: number;

  equipment: EquipmentStoreState;   // equipment
  effects: Effect[];          // combat effects
  inventory: (null | Item)[];
  basicAttributes: BasicAttributesStoreState;
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
  yellow
}


export interface EquipmentStoreState {
  [EquipmentSlotType.head]?: Item<Apparel>;
  [EquipmentSlotType.shoulders]?: Item<Apparel>;
  [EquipmentSlotType.chest]?: Item<Apparel>;
  [EquipmentSlotType.hands]?: Item<Apparel>;
  [EquipmentSlotType.legs]?: Item<Apparel>;
  [EquipmentSlotType.feet]?: Item<Apparel>;
  [EquipmentSlotType.mainHand]?: Item<Weapon>;
  [EquipmentSlotType.offHand]?: Item<Weapon> | Item<Ammunition>;
}

export interface BasicAttributesStoreState {
  str: number;
  for: number;
  int: number;
  agi: number;
}

export type BasicAttribute = keyof BasicAttributesStoreState;

export type SkillsStoreState = {
  [key in WeaponType]?: number
}

