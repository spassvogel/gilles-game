import { Item } from "../items/types";
import { ResourceStoreState } from 'stores/resources';


export interface CostStoreState {
    gold?: number;
    time?: number;
    resources?: ResourceStoreState;
    materials?: Item[];
}

export interface ProductionDefinition {
    item: Item;
    cost: CostStoreState;
}
