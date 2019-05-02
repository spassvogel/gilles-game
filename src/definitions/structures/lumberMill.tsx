// tslint:disable:object-literal-sort-keys

import { ResourceStructureDefinition, StructureType } from "./types";

const lumberMill: ResourceStructureDefinition = {
    type: StructureType.resource,
    goldCost: 31,
    buildTime: 50000,
    levels: [{
        // level 0:
        displayName: "structure-lumber-mill-name",
        workerCapacity: 2,
        cost: 0,
        generates: { wood: 2 },
    }, {
        // level 1:
        displayName: "structure-lumber-mill-name",
        workerCapacity: 5,
        cost: 30,
        generates: { wood: 2 },
    }, {
        // level 2:
        displayName: "structure-lumber-mill-name",
        workerCapacity: 10,
        cost: 50,
        generates: { wood: 2 },
    }],
};

export default lumberMill;
