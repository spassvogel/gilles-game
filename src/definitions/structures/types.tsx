import { ResourceStoreState } from "src/stores/resources";
import { ProductionDefinition } from "../production/types";

export enum StructureType {
    resource,
    production,
    tavern,
    warehouse,
}

export interface StructureDefinition {
    type: StructureType;
    goldCost: number;
    buildTime: number;
    levels: StructureLevelDefinition[];
}

export interface StructureLevelDefinition {
    displayName: string;          // At this moment we can potentially support different names depending on the level
                                  // of the structure. But this is not implemented because I feel it can cause confusion
    cost: number;                 // in gold
    workerCapacity: number;       // number of workers that can work at this structure at this level
}

export interface ResourceStructureDefinition extends StructureDefinition {
    levels: ResourceStructureLevelDefinition[];
}

export interface ResourceStructureLevelDefinition extends StructureLevelDefinition {
    generates: ResourceStoreState;
}

export interface ProductionStructureDefinition extends StructureDefinition {
    levels: ProductionStructureLevelDefinition[];
}

export interface ProductionStructureLevelDefinition extends StructureLevelDefinition {
    produces: ProductionDefinition[];
}

// tslint:disable-next-line:no-empty-interface
export interface WarehousetructureDefinition extends StructureDefinition {
    // todo: fill in later
}

// tslint:disable-next-line:no-empty-interface
export interface TavernStructureDefinition extends StructureDefinition {
    // todo: fill in later
}
