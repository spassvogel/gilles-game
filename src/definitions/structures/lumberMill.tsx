// tslint:disable:object-literal-sort-keys

import { ResourceStructureDefinition, StructureType } from "./types";

const lumberMill: ResourceStructureDefinition = {
    type: StructureType.resource,
    goldCost: 41,
    buildTime: 5000,
    levels: [{
        // level 0:
        displayName: "Woodcutter",
        workerCapacity: 2,
        cost: 0,
        generates: { wood: 2 },
    }, {
        // level 1:
        displayName: "Lumber mill ",
        workerCapacity: 5,
        cost: 30,
        generates: { wood: 2 },
    }, {
        // level 2:
        displayName: "Lumberyard",
        workerCapacity: 10,
        cost: 50,
        generates: { wood: 2 },
    }],
};

export default lumberMill;
