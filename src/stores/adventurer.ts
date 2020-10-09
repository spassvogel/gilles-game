import { Item } from "definitions/items/types";
import { Trait } from 'definitions/traits/types';

export interface AdventurerStoreState {
    id: string;
    name: string;
    avatarImg: string;
    spritesheetPath: string;            // Path to JSON of spritesheet to use in scenes
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

export interface EquipmentStoreState {
    head?: Item;
    shoulders?: Item;
    chest?: Item;
    hands?: Item;
    legs?: Item;
    feet?: Item;
    mainHand?: Item;
    offHand?: Item;
    sideArm?: Item;
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
