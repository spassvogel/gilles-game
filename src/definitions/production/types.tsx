import { CostStoreState } from "reducers";
import { ResourceStoreState } from "stores/resources";
import { Item } from "../items/types";

export interface ProductionDefinition {
    item: Item;
    cost: CostStoreState;
}
