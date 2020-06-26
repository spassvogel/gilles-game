// tslint:disable:object-literal-sort-keys

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

export function getDefinition<T extends StructureDefinition>(structure: string): T {
    return all[structure] as T;
}

export function getStructureByResource(resource: Resource) : Structure {
    switch (resource) {
        case Resource.fabric:
            return Structure.weaver;
        case Resource.food:
            return Structure.garden;
        case Resource.iron:
            return Structure.mine;
        case Resource.leather:
            return Structure.tannery;
        case Resource.stone:
            return Structure.quarry;
        case Resource.wood:
            return Structure.lumberMill;
    }
}
