import { Item } from "src/definitions/items/types";

export interface AdventurerStoreState {
    id: string;
    name: string;
    avatarImg: string;

    gear: GearStoreState;     // equipment
    // tslint:disable-next-line:max-line-length
    inventory: Array<null | Item>;
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
