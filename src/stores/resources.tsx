export interface ResourceStoreState {
    wood?: number;
    iron?: number;
    steel?: number;
    leather?: number;
    gunpowder?: number;
    food?: number;
}

export const initialState: ResourceStoreState = {
    food: 0,
    gunpowder: 0,
    iron: 60,
    leather: 0,
    steel: 50,
    wood: 40,
};
