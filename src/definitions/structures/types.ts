import { Item } from "definitions/items/types";
import { ResourceStoreState } from "store/types/resources";
import { ProducableItem } from "store/types/structure";
import { CostStoreState } from "../production/types";

export enum StructureType {
  resource,
  production,
  tavern,
  warehouse,
}

export interface StructureDefinition {
  type: StructureType;
  cost: CostStoreState;
  levels: StructureLevelDefinition[];
}

export interface StructureLevelDefinition {
  displayName: string;      // At this moment we can potentially support different names depending on the level
                            // of the structure. But this is not implemented because I feel it can cause confusion
  cost: CostStoreState;     //
  workerCapacity: number;   // number of workers that can work at this structure at this level
}

export interface ResourceStructureDefinition extends StructureDefinition {
  levels: ResourceStructureLevelDefinition[];
}

interface HarvestDefinition {
  amount: number;
  lootTable: {[key in Item]?: number};
}

export interface ResourceStructureLevelDefinition extends StructureLevelDefinition {
  generates: ResourceStoreState;
  harvest?: HarvestDefinition;
}

export interface ProductionStructureDefinition extends StructureDefinition {
  levels: ProductionStructureLevelDefinition[];
}

export interface ProductionStructureLevelDefinition extends StructureLevelDefinition {
  unlocks: ProducableItem[];
}

export interface WarehouseStructureDefinition extends StructureDefinition {
  levels: WarehouseStructureLevelDefinition[];
}

export interface WarehouseStructureLevelDefinition extends StructureLevelDefinition {
  maxResources: ResourceStoreState;
  maxStockpile: number;
}

export interface TavernStructureDefinition extends StructureDefinition {
  levels: TavernStructureLevelDefinition[];
}

export interface TavernStructureLevelDefinition extends StructureLevelDefinition {
  rooms: number;
}
