import { ResourceStoreState } from "src/stores/resources";
import { Item } from "../items/types";

export interface ProductionDefinition {
    item: Item;
    costResources: ResourceStoreState;
    time: number;
    // TODO: Can also require a number of Items
}
