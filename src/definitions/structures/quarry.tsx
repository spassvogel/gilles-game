// tslint:disable:object-literal-sort-keys

import { ProductionStructureDefinition, StructureType } from "./types";

const quarry: ProductionStructureDefinition = {
    goldCost: 40,
    buildTime: 4000,
    type: StructureType.production,
    levels: [{
        displayName: "structure-quarry-name",
        // level 1:
        workerCapacity: 2,
        cost: 0,
        produces: [],
    }, {
        // level 2:
        displayName: "structure-quarry-name",
        workerCapacity: 5,
        cost: 30,
        produces: [],
    }, {
        // level 3:
        displayName: "structure-quarry-name",
        workerCapacity: 10,
        cost: 50,
        produces: [],
    }],
};

export default quarry;
