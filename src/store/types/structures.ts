import { Structure } from "definitions/structures";
import { ProductionStructureStoreState, ResourceStructureState, StructureStoreState } from "./structure";

// See: https://stackoverflow.com/questions/51829842/how-to-force-interface-to-implement-keys-of-enum-in-typescript-3-0
class Temp implements Record<Structure, ResourceStructureState> {
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

export type StructuresStoreState = Temp
