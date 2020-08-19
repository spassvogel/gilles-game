import { Item } from 'definitions/items/types';

export enum StructureState {
    NotBuilt,
    Building,
    Built,
}

export interface StructureStoreState {
    level: number;
    workers: number;
    state: StructureState;
}

export const initialState: StructureStoreState = {
    level: 0,
    state: StructureState.NotBuilt,
    workers: 0,
};

export interface ProductionStructureStoreState extends StructureStoreState {
    produces: Item[];
}
