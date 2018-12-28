// tslint:disable:object-literal-sort-keys
import { ResourceStructureDefinition, StructureType } from "./types";

export const weaver: ResourceStructureDefinition = {
    goldCost: 40,
    buildTime: 4000,
    type: StructureType.resource,
    levels: [{
        displayName: "Weaver",
        // level 0:
        workerCapacity: 2,
        cost: 0,
        generates: { },
    }, {
        displayName: "Weaver",
        // level 1:
        workerCapacity: 5,
        cost: 30,
        generates: { },
    }, {
        displayName: "Textile plant",
        // level 2:
        workerCapacity: 10,
        cost: 50,
        generates: { },
    }],
};
