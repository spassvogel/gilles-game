import { ONE_MINUTE, TWO_MINUTES } from 'utils/format/time';
import { ResourceStructureDefinition, StructureType } from "./types";

const tannery: ResourceStructureDefinition = {
    cost: {
        gold: 40,
        time: 4000,
    },
    type: StructureType.resource,
    levels: [{
        displayName: "structure-tannery-name",
        // level 1:
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        generates: { leather: 2 },
    }, {
        // level 2:
        displayName: "structure-tannery-name",
        workerCapacity: 5,
        cost: {
            gold: 30,
            time: ONE_MINUTE
        },
        generates: { leather: 5 },
    }, {
        // level 3:
        displayName: "structure-tannery-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
            time: TWO_MINUTES
        },
        generates: { leather: 7 },
    }],
};

export default tannery;
