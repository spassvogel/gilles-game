export interface StoreState {
    weapons: WeaponsStoreState
}

export interface WeaponsStoreState {
    crossbows: number,
    longbows: number,
    swords: number,
    daggers: number
}

export const Weapons = {
    CROSSBOWS: 'crossbows',
    LONGBOWS: 'longbows',
    SWORDS: 'swords',
    DAGGERS: 'daggers',
};