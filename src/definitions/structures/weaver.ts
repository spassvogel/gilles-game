import { ONE_MINUTE, THREE_MINUTES } from 'utils/format/time';
import { ResourceStructureDefinition, StructureType } from "./types";

const weaver: ResourceStructureDefinition = {
    cost: {
        gold: 40,
        time: 4000,
    },
    type: StructureType.resource,
    levels: [{
        displayName: "structure-weaver-name",
        // level 0:
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        generates: { fabric: 2 },
    }, {
        displayName: "structure-weaver-name",
        // level 1:
        workerCapacity: 5,
        cost: {
            gold: 30,
            time: ONE_MINUTE
        },
        generates: { fabric: 5 },
    }, {
        displayName: "structure-weaver-name",
        // level 2:
        workerCapacity: 10,
        cost: {
            gold: 50,
            time: THREE_MINUTES
        },
        generates: { fabric: 7 },
    }],
};

export default weaver;
