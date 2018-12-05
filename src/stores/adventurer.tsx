import { Equipment } from "src/definitions/equipment/types";

export interface AdventurerStoreState {
    id: string;
    name: string;
    avatarImg: string;

    gear: GearStoreState;     // equipment
    inventory: Array<Equipment | Equipment[]>;   // todo: put other stuff in inventory besides equipment?
    stats: StatsStoreState;
}

// Gear means the equipment an adventurer is carrying
export interface GearStoreState {
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
