import { ONE_MINUTE, TWO_MINUTES } from 'utils/format/time';
import { ResourceStructureDefinition, StructureType } from "./types";

const mine: ResourceStructureDefinition = {
    cost: {
        gold: 40,
        time: 4000,
    },
    type: StructureType.resource,
    levels: [{
        displayName: "structure-mine-name",
        // level 0:
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        generates: { iron: 2 },     
        harvest: {
            amount: 3,
            lootTable: {
                "mineral/roseQuartz": 2,
                "mineral/topaz": 1
            }
        }
    }, {
        displayName: "structure-mine-name",
        // level 1:
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
        generates: { iron: 2 },
        harvest: {
            amount: 5,
            lootTable: {
                "mineral/roseQuartz": 2,
                "mineral/topaz": 2,
                "mineral/jasper": 1,
                "mineral/greenOpal": 1,
            }
        }
    }, {
        displayName: "structure-mine-name",
        // level 2:
        workerCapacity: 10,
        cost: {
            gold: 50,
            time: TWO_MINUTES
        },
        generates: { iron: 2 },
        harvest: {
            amount: 5,
            lootTable: {
                "mineral/roseQuartz": 1,
                "mineral/topaz": 1,
                "mineral/jasper": 1,
                "mineral/greenOpal": 1,
                "mineral/malachite": 1,
                "mineral/tigersEye": 1,
            }
        }
    }],
};
export default mine;
