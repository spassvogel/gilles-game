// tslint:disable:object-literal-sort-keys

import { StructureDefinition, StructureType } from "./types";

const tavern: StructureDefinition = {
    type: StructureType.tavern,
    levels: [{
        displayName: "Way Station",
        // level 1:
        workerCapacity: 2,
    }, {
        // level 2:
        displayName: "Tavern",
        workerCapacity: 5,
        cost: 30,
    }, {
        // level 3:
        displayName: "Great Hall",
        workerCapacity: 10,
        cost: 50,
    }],
};

export default tavern;
