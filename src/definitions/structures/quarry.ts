import { ONE_MINUTE, TWO_MINUTES } from 'utils/format/time';
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
            resources: {
                wood: 100,
                iron: 100,
                stone: 100
            },
            time: ONE_MINUTE
        },
        generates: { stone: 4 },
    }, {
        // level 3:
        displayName: "structure-quarry-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
            time: TWO_MINUTES
        },
        generates: { stone: 6 },
    }],
};

export default quarry;
