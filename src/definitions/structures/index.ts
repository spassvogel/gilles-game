import alchemist from "./alchemist";
import armoursmith from "./armoursmith";
import garden from "./garden";
import lumberMill from "./lumberMill";
import mine from "./mine";
import quarry from "./quarry";
import tannery from "./tannery";
import tavern from "./tavern";
import { StructureDefinition } from "./types";
import warehouse from "./warehouse";
import weaponsmith from "./weaponsmith";
import weaver from "./weaver";
import workshop from "./workshop";
import { Resource } from 'definitions/resources';

export type Structure =
  "alchemist" |
  "armoursmith" |
  "garden" |
  "lumberMill" |
  "mine" |
  "quarry" |
  "tavern" |
  "tannery" |
  "warehouse" |
  "weaponsmith" |
  "weaver" |
  "workshop";


export type ProductionStructure = "alchemist" | "armoursmith" | "weaponsmith" | "workshop";
export type ResourceStructure = "garden" | "lumberMill" | "mine" | "quarry" | "tannery" | "weaver";

// Type guard
export const isProductionStructure = (structure: Structure): structure is ProductionStructure => {
  return structure === "alchemist" ||
    structure === "armoursmith" ||
    structure === "weaponsmith" ||
    structure === "workshop";
}
// Type guard
export const isResourceStructure = (structure: Structure): structure is ResourceStructure => {
  return structure === "garden" ||
    structure === "lumberMill" ||
    structure === "mine" ||
    structure === "quarry" ||
    structure === "tannery" ||
    structure === "weaver";
}
const all = {
  alchemist,
  armoursmith,
  garden,
  lumberMill,
  mine,
  quarry,
  tavern,
  tannery,
  warehouse,
  weaponsmith,
  weaver,
  workshop,
};

export default all;

export function getDefinition<T extends StructureDefinition>(structure: Structure): T {
  return all[structure] as unknown as T;
}



export function getStructureByResource(resource: Resource) : Structure {
  switch (resource) {
    case Resource.fabric:
      return "weaver";
    case Resource.food:
      return "garden";
    case Resource.iron:
      return "mine";
    case Resource.leather:
      return "tannery";
    case Resource.stone:
      return "quarry";
    case Resource.wood:
      return "lumberMill";
  }
}
