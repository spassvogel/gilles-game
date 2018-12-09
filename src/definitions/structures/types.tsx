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
    levels: StructureLevelDefinition[];
}

export interface StructureLevelDefinition {
    displayName: string;
    cost: number;                // in gold
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

export interface WarehousetructureDefinition extends StructureDefinition {
}