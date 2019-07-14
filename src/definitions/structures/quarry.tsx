// tslint:disable:object-literal-sort-keys

import { ProductionStructureDefinition, StructureType } from "./types";

const quarry: ProductionStructureDefinition = {
    cost: {
        gold: 40,
        time: 4000,
    },
    type: StructureType.production,
    levels: [{
        displayName: "structure-quarry-name",
        // level 1:
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        produces: [],
    }, {
        // level 2:
        displayName: "structure-quarry-name",
        workerCapacity: 5,
        cost: {
            gold: 30,
        },
        produces: [],
    }, {
        // level 3:
        displayName: "structure-quarry-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
        },
        produces: [],
    }],
};

export default quarry;
