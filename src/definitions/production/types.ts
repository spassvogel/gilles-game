import { CostStoreState } from "reducers";
import { Item } from "../items/types";

export interface ProductionDefinition {
    item: Item;
    cost: CostStoreState;
}
