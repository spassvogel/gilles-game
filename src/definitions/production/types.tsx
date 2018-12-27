import { ResourceStoreState } from "src/stores/resources";
import { Item } from "../items/types";

export interface ProductionDefinition {
    equipment: Item;
    cost: ResourceStoreState;
    time: number;
}
