import { Item, ItemType } from 'definitions/items/types';
import { ResourceStoreState } from 'store/types/resources';


export interface CostStoreState {
  gold?: number;
  time?: number;
  resources?: ResourceStoreState;
  materials?: ItemType[];
}

export interface ProductionDefinition {
  item: Item;
  cost: CostStoreState;
  levelRequired?: number;
}
