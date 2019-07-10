// tslint:disable:object-literal-sort-keys

import { StructureType, TavernStructureDefinition } from "./types";

const tavern: TavernStructureDefinition = {
    cost: {
        gold: 40,
        time: 4000,
    },
    type: StructureType.tavern,
    levels: [{
        displayName: "structure-tavern-name",
        // level 1:
        workerCapacity: 2,
        cost: 0,
    }, {
        // level 2:
        displayName: "structure-tavern-name",
        workerCapacity: 5,
        cost: 30,
    }, {
        // level 3:
        displayName: "structure-tavern-name",
        workerCapacity: 10,
        cost: 50,
    }],
};

export default tavern;
