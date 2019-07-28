// tslint:disable:object-literal-sort-keys

import alchemist from "./alchemist";
import armoursmith from "./armoursmith";
import garden from "./garden";
import lumberMill from "./lumberMill";
import mine from "./mine";
import quarry from "./quarry";
import tannery from "./tannery";
import tavern from "./tavern";
import { ProductionStructureDefinition,
    ResourceStructureDefinition,
    WarehouseStructureDefinition } from "./types";
import warehouse from "./warehouse";
import weaponsmith from "./weaponsmith";
import weaver from "./weaver";
import workshop from "./workshop";

export enum Structure {
    alchemist = "alchemist",
    armoursmith = "armoursmith",
    garden = "garden",
    lumberMill = "lumberMill",
    mine = "mine",
    quarry = "quarry",
    tavern = "tavern",
    tannery = "tannery",
    warehouse = "warehouse",
    weaponsmith = "weaponsmith",
    weaver = "weaver",
    workshop = "workshop",
}

export type StructureDefinition = WarehouseStructureDefinition |
ResourceStructureDefinition | ProductionStructureDefinition;

export default {
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
