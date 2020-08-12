import { Item } from "definitions/items/types";
import { Trait } from 'definitions/traits/types';

export interface AdventurerStoreState {
    id: string;
    name: string;
    avatarImg: string;
    traits?: Trait[];
    health: number;                     // When this reaches zero, the adventurer is dead

    equipment: EquipmentStoreState;     // equipment
    inventory: (null | Item)[];
    stats: StatsStoreState;
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

// Mom I'm SPECIAL
export interface StatsStoreState {
    strength: number;
    perception: number;
    endurance: number;
    charisma: number;
    intelligenge: number;
    agility: number;
    luck: number;
}
