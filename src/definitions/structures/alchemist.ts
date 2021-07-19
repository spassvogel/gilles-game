import { ONE_MINUTE, TWO_MINUTES } from 'utils/format/time';
import { ProductionStructureDefinition, StructureType } from "./types";

const alchemist: ProductionStructureDefinition = {
    type: StructureType.production,
    cost: {
        gold: 40,
        time: 4000,
    },
    levels: [{
        displayName: "structure-alchemist-name",
        // level 1:
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        unlocks: [],
    }, {
        // level 2:
        displayName: "structure-alchemist-name",
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
        unlocks: [],
    }, {
        // level 3:
        displayName: "structure-alchemist-name",
        workerCapacity: 10,
        cost: {
             gold: 50,
             time: TWO_MINUTES
        },
        unlocks: [],
    }],
};

export default alchemist;
