import { ResourceStoreState } from "src/stores/resources";
import { Item } from "../items/types";

export interface ProductionDefinition {
    item: Item;
    costResources: ResourceStoreState;
    costItems?: Item[]; // cost of materials
    time: number;
}
