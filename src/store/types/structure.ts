import { Apparel } from 'definitions/items/apparel';
import { QuestItem } from 'definitions/items/questItems';
import { Weapon } from 'definitions/items/weapons';

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

export type ProducableItem = Weapon | Apparel | QuestItem;
export interface ProductionStructureStoreState extends StructureStoreState {
    produces: ProducableItem[];
}
