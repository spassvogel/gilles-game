// The keys should be the same as the enum Resource
export interface ResourceStoreState {
    wood?: number;
    iron?: number;
    steel?: number;
    leather?: number;
    gunpowder?: number;
    food?: number;
    fabric?: number;
}

export const initialState: ResourceStoreState = {
    food: 0,
    gunpowder: 0,
    iron: 60,
    leather: 0,
    steel: 50,
    wood: 40,
};
