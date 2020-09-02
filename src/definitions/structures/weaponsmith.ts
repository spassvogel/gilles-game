// tslint:disable:object-literal-sort-keys
import { ProductionStructureDefinition, StructureType } from "./types";
import { Item } from 'definitions/items/types';

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
        },
        unlocks: [],
    }, {
        // level 3:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
        },
        unlocks: [],
    }, {
        // level 4:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 14,
        cost: {
            gold: 50,
        },
        unlocks: [Item.poisonedDagger],
    }],
};
export default weaponsmith;
