import { ResourceStoreState } from "src/stores/resources";
import { Equipment } from "../equipment/types";

export interface ProductionDefinition {
    equipment: Equipment;
    cost: ResourceStoreState;
    time: number;
}
