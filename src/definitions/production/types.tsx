import { CostStoreState } from "src/reducers";
import { ResourceStoreState } from "src/stores/resources";
import { Item } from "../items/types";

export interface ProductionDefinition {
    item: Item;
    cost: CostStoreState;
}
