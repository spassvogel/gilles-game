// tslint:disable:object-literal-sort-keys

import { ProductionStructureDefinition, StructureType } from "./types";

const quarry: ProductionStructureDefinition = {
    goldCost: 40,
    buildTime: 4000,
    type: StructureType.production,
    levels: [{
        displayName: "Hole in the rocky ground",
        // level 1:
        workerCapacity: 2,
        cost: 0,
        produces: [],
    }, {
        // level 2:
        displayName: "Pit",
        workerCapacity: 5,
        cost: 30,
        produces: [],
    }, {
        // level 3:
        displayName: "Quarry",
        workerCapacity: 10,
        cost: 50,
        produces: [],
    }],
};

export default quarry;
