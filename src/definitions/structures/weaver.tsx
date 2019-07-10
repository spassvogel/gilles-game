// tslint:disable:object-literal-sort-keys
import { ResourceStructureDefinition, StructureType } from "./types";

export const weaver: ResourceStructureDefinition = {
    cost: {
        gold: 40,
        time: 4000,
    },
    type: StructureType.resource,
    levels: [{
        displayName: "structure-weaver-name",
        // level 0:
        workerCapacity: 2,
        cost: 0,
        generates: { fabric: 2 },
    }, {
        displayName: "structure-weaver-name",
        // level 1:
        workerCapacity: 5,
        cost: 30,
        generates: { fabric: 5 },
    }, {
        displayName: "structure-weaver-name",
        // level 2:
        workerCapacity: 10,
        cost: 50,
        generates: { fabric: 7 },
    }],
};
