// tslint:disable:object-literal-sort-keys
import { ProductionStructureDefinition, StructureType } from "./types";
import { Item } from 'definitions/items/types';
import { ONE_MINUTE, THREE_MINUTES, TWO_MINUTES } from 'utils/format/time';

const weaponsmith: ProductionStructureDefinition = {
    type: StructureType.production,
    cost: {
        gold: 40,
        time: 4000,
    },
    levels: [{
        // level 1:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        unlocks: [],
    }, {
        // level 2:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 5,
        cost: {
            gold: 30,
            time: ONE_MINUTE
        },
        unlocks: [],
    }, {
        // level 3:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
            time: TWO_MINUTES

        },
        unlocks: [],
    }, {
        // level 4:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 14,
        cost: {
            gold: 50,
            time: THREE_MINUTES
        },
        unlocks: [Item.poisonedDagger],
    }],
};
export default weaponsmith;
