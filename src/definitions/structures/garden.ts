import { ONE_MINUTE, TWO_MINUTES } from 'utils/format/time';
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
        harvest: {
            amount: 3,
            lootTable: {
                "herb/bogroot": 2,
                "herb/winterWeed": 1
            }
        }
    }, {
        displayName: "structure-garden-name",
        // level 2:
        workerCapacity: 5,
        cost: {
            gold: 30,
            time: ONE_MINUTE
        },
        generates: { food: 4 },
        harvest: {
            amount: 5,
            lootTable: {
                "herb/bogroot": 2,
                "herb/winterWeed": 1,
                "herb/hyacinthus": 1, 
                "herb/bloodLotus": 1, 
            }
        }
    }, {
        // level 3:
        displayName: "structure-garden-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
            time: TWO_MINUTES
        },
        generates: { food: 8 },
    }],
};

export default garden;
