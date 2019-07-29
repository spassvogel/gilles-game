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

export interface EquipmentStoreState { // todo: make into Items
    head?: string;
    shoulders?: string;
    chest?: string;
    hands?: string;
    legs?: string;
    feet?: string;
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
