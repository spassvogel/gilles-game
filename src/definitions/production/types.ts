import { Item } from 'definitions/items/types';
import { ResourceStoreState } from 'store/types/resources';


export interface CostStoreState {
    gold?: number;
    time?: number;
    resources?: ResourceStoreState;
    materials?: Item[];
}

export interface ProductionDefinition {
    item: Item;
    cost: CostStoreState;
    levelRequired?: number;
}
