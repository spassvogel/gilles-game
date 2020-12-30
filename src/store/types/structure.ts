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

export interface ProductionStructureStoreState extends StructureStoreState {
    produces: Item[];
}
