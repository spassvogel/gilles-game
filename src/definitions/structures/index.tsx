// tslint:disable:object-literal-sort-keys

import armoursmith from "./armoursmith";
import farm from "./farm";
import lumberMill from "./lumberMill";
import tannery from "./tannery";
import { ResourceStructureDefinition, StructureType } from "./types";
import weaponsmith from "./weaponsmith";

export enum Structure {
    lumberMill = "lumberMill",
    ironMine = "ironMine",
    farm = "farm",
    tannery = "tannery",
    armoursmith = "armoursmith",
    weaponsmith = "weaponsmith",
}

const ironMine: ResourceStructureDefinition = {
    type: StructureType.resource,
    levels: [{
        displayName: "Hole in the rocky ground",
        // level 0:
        workerCapacity: 2,
        generates: { iron: 2 },
    }, {
        displayName: "A small mine",
        // level 1:
        workerCapacity: 5,
        cost: 30,
        generates: { iron: 2 },
    }, {
        displayName: "A large mine",
        // level 2:
        workerCapacity: 10,
        cost: 50,
        generates: { iron: 2 },
    }],
};

export default {
    lumberMill,
    ironMine,
    farm,
    tannery,
    weaponsmith,
    armoursmith,
};
