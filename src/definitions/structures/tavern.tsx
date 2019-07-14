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
        cost: {
             gold: 0,
        },
        rooms: 10,
    }, {
        // level 2:
        displayName: "structure-tavern-name",
        workerCapacity: 5,
        cost: {
             gold: 30,
        },
        rooms: 12,
    }, {
        // level 3:
        displayName: "structure-tavern-name",
        workerCapacity: 10,
        cost: {
             gold: 50,
        },
        rooms: 15,
    }],
};

export default tavern;
