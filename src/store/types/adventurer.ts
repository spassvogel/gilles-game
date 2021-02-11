import { EquipmentSlotType } from "components/ui/adventurer/EquipmentSlot";
import { Item } from "definitions/items/types";
import { Trait } from 'definitions/traits/types';

export interface AdventurerStoreState {
    id: string;
    name: string;
    avatarImg: string;
    spritesheetPath: string;            // Path to JSON of spritesheet to use in scenes
    color?: AdventurerColor;
    traits?: Trait[];
    health: number;                     // When this reaches zero, the adventurer is dead
    xp: number;
    baseAP: number;                     // Amount of AP this adventurer has

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
    [EquipmentSlotType.head]?: Item;
    [EquipmentSlotType.shoulders]?: Item;
    [EquipmentSlotType.chest]?: Item;
    [EquipmentSlotType.hands]?: Item;
    [EquipmentSlotType.legs]?: Item;
    [EquipmentSlotType.feet]?: Item;
    [EquipmentSlotType.mainHand]?: Item;
    [EquipmentSlotType.offHand]?: Item;
}

export interface BasicAttributesStoreState {
    strength: number;
    dexterity: number;
    intelligence: number;
    health: number;
}

export interface SkillsStoreState {
    [key: string]: number
}
