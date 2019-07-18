import { Item } from "definitions/items/types";

export interface AdventurerStoreState {
    id: string;
    name: string;
    avatarImg: string;
    health: number;                     // When this reaches zero, the adventurer is dead

    equipment: EquipmentStoreState;     // equipment
    inventory: Array<null | Item>;
    stats: StatsStoreState;
    room: number;                       // Adventurer is lodged in this room in the tavern
}

export interface EquipmentStoreState {
    head?: string;
    body?: string;
    arms?: string;
    feet?: string;
    accessories?: string;
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
