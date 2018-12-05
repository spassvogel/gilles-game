import { ResourceStoreState } from "src/stores/resources";
import { Equipment } from "../equipment";

export interface ProductionDefinition {
    equipment: Equipment;
    cost: ResourceStoreState;
    time: number;
}
