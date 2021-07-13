import { ResourceStructure, Structure } from "definitions/structures";
import { ProductionStructureStoreState, ResourceStructureState, StructureStoreState } from "./structure";

export interface StructuresStoreState { // todo: enforce keys are from Structure
    "alchemist": ProductionStructureStoreState;
    "armoursmith": ProductionStructureStoreState;
    "garden": ResourceStructureState;
    "lumberMill": ResourceStructureState;
    "mine": ResourceStructureState;
    "quarry": ResourceStructureState;
    "tavern": StructureStoreState;
    "tannery": ResourceStructureState;
    "warehouse": StructureStoreState;
    "weaponsmith": ProductionStructureStoreState;
    "weaver": ResourceStructureState;
    "workshop": ProductionStructureStoreState;
}
