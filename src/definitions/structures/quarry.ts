// tslint:disable:object-literal-sort-keys
import { ResourceStructureDefinition, StructureType } from "./types";

const quarry: ResourceStructureDefinition = {
    cost: {
        gold: 40,
        time: 4000,
    },
    type: StructureType.resource,
    levels: [{
        displayName: "structure-quarry-name",
        // level 1:
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        generates: { stone: 2 },
    }, {
        // level 2:
        displayName: "structure-quarry-name",
        workerCapacity: 5,
        cost: {
            gold: 30,
        },
        generates: { stone: 4 },
    }, {
        // level 3:
        displayName: "structure-quarry-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
        },
        generates: { stone: 6 },
    }],
};

export default quarry;
