import { Item } from "src/definitions/items/types";

export interface AdventurerStoreState {
    id: string;
    name: string;
    avatarImg: string;

    equipment: EquipmentStoreState;     // equipment
    inventory: Array<null | Item>;
    stats: StatsStoreState;
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
