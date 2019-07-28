// tslint:disable:object-literal-sort-keys
import { torch } from "definitions/production/questItems";
import { ProductionStructureDefinition, StructureType } from "./types";

const workshop: ProductionStructureDefinition = {
    type: StructureType.production,
    cost: {
        gold: 40,
        time: 4000,
    },
    levels: [{
        // level 1:
        displayName: "structure-workshop-name",
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        produces: [ torch ],
    }, {
        // level 2:
        displayName: "structure-workshop-name",
        workerCapacity: 5,
        cost: {
            gold: 30,
        },
        produces: [],
    }, {
        // level 3:
        displayName: "structure-workshop-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
        },
        produces: [],
    }, {
        // level 4:
        displayName: "structure-workshop-name",
        workerCapacity: 14,
        cost: {
            gold: 50,
        },
        produces: [],
    }],
};
export default workshop;
