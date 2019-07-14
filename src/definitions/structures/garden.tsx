// tslint:disable:object-literal-sort-keys
import { ResourceStructureDefinition, StructureType } from "./types";

const garden: ResourceStructureDefinition = {
    type: StructureType.resource,
    cost: {
        gold: 40,
        time: 4000,
    },
    levels: [{
        displayName: "structure-garden-name",
        // level 1:
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        generates: { food: 2 },
    }, {
        displayName: "structure-garden-name",
        // level 2:
        workerCapacity: 5,
        cost: {
            gold: 30,
        },
        generates: { food: 2 },
    }, {
        // level 3:
        displayName: "structure-garden-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
        },
        generates: { food: 2 },
    }],
};

export default garden;
