// tslint:disable:object-literal-sort-keys

import { ResourceStructureDefinition, StructureType } from "./types";

const tannery: ResourceStructureDefinition = {
    goldCost: 40,
    buildTime: 4000,
    type: StructureType.resource,
    levels: [{
        displayName: "structure-tannery-name",
        // level 1:
        workerCapacity: 2,
        cost: 0,
        generates: { leather: 2 },
    }, {
        // level 2:
        displayName: "structure-tannery-name",
        workerCapacity: 5,
        cost: 30,
        generates: { leather: 5 },
    }, {
        // level 3:
        displayName: "structure-tannery-name",
        workerCapacity: 10,
        cost: 50,
        generates: { leather: 7 },
    }],
};

export default tannery;
