export interface ResourceStoreState {
    wood?: number,
    iron?: number,
    steel?: number,
    leather?: number,
    gunpowder?: number,
    food?: number
}

export const initialState:ResourceStoreState = {
    wood: 3,
    iron: 4,
    steel: 0,
    leather: 0,
    gunpowder: 0,
    food: 0
}