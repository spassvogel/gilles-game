import { Resource } from "src/definitions/resources";

// The keys should be the same as the enum Resource
export interface ResourceStoreState {
    [Resource.wood]?: number;
    [Resource.iron]?: number;
    [Resource.stone]?: number;
    [Resource.leather]?: number;
    [Resource.fabric]?: number;
    [Resource.food]?: number;
    [Resource.gunpowder]?: number;
}

export const initialState: ResourceStoreState = {
    fabric: 0,
    food: 0,
    gunpowder: 0,
    iron: 60,
    leather: 0,
    stone: 0,
    wood: 40,
};
