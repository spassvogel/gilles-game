// tslint:disable:object-literal-sort-keys

import { ResourceStructureDefinition, StructureType } from "./types";
import { HALF_HOUR } from 'utils/time';

const lumberMill: ResourceStructureDefinition = {
    type: StructureType.resource,
    cost: {
        gold: 31,
        time: HALF_HOUR,
    },
    levels: [{
        // level 0:
        displayName: "structure-lumberMill-name",
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        generates: { wood: 2 },
    }, {
        // level 1:
        displayName: "structure-lumberMill-name",
        workerCapacity: 5,
        cost: {
            gold: 30,
        },
        generates: { wood: 2 },
    }, {
        // level 2:
        displayName: "structure-lumberMill-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
        },
        generates: { wood: 2 },
    }],
};

export default lumberMill;
