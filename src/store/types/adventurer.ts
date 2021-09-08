import { EquipmentSlotType } from "components/ui/adventurer/EquipmentSlot";
import { Apparel } from "definitions/items/apparel";
import { Item } from "definitions/items/types";
import { Weapon } from "definitions/items/weapons";
import { Trait } from 'definitions/traits/types';

export interface AdventurerStoreState {
    id: string;
    name?: string;
    flavor?: boolean;                   // Has lore text, language key: `adventurer-{id}-flavor
    avatarImg: string;
    spritesheetPath: string;            // Path to JSON of spritesheet to use in scenes
    color?: AdventurerColor;
    traits?: Trait[];
    health: number;                     // When this reaches zero, the adventurer is dead
    xp: number;

    equipment: EquipmentStoreState;     // equipment
    inventory: (null | Item)[];
    basicAttributes: BasicAttributesStoreState;
    skills: SkillsStoreState;           //
    room: number;                       // Adventurer is lodged in this room in the tavern
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
    [EquipmentSlotType.head]?: Apparel;
    [EquipmentSlotType.shoulders]?: Apparel;
    [EquipmentSlotType.chest]?: Apparel;
    [EquipmentSlotType.hands]?: Apparel;
    [EquipmentSlotType.legs]?: Apparel;
    [EquipmentSlotType.feet]?: Apparel;
    [EquipmentSlotType.mainHand]?: Weapon;
    [EquipmentSlotType.offHand]?: Weapon;
}

export interface BasicAttributesStoreState {
    str: number;
    dex: number;
    int: number;
    hlt: number;
}

export interface SkillsStoreState {
    [key: string]: number
}
