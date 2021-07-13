import { ProductionStructureStoreState, ResourceStructureState, StructureStoreState } from "./structure";

export type StructuresStoreState = { // todo: enforce keys are from Structure
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

