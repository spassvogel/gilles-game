export interface AdventurerStoreState {
    id:string
    name:string,
    avatarImg:string

    // equipment
    gear:GearStoreState
    stats:StatsStoreState
}

// Gear means the equipment an adventurer is carrying
export interface GearStoreState {
    head?:string,
    body?:string,
    arms?:string,
    feet?:string,
    accessories?:string
}

// Mom I'm SPECIAL
export interface StatsStoreState {
    strength:number,
    perception:number,
    endurance:number,
    charisma:number,
    intelligenge:number,
    agility:number,
    luck:number
}