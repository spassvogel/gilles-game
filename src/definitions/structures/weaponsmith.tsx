// tslint:disable:object-literal-sort-keys

import { crossbow, dagger, khopesh, longbow, poisonedDagger, sword } from "../production/weapons";
import { ProductionStructureDefinition, StructureType } from "./types";

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
        produces: [crossbow, dagger],
    }, {
        // level 2:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 5,
        cost: {
            gold: 30,
        },
        produces: [crossbow, dagger, longbow],
    }, {
        // level 3:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
        },
        produces: [crossbow, dagger, longbow, sword, khopesh],
    }, {
        // level 4:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 14,
        cost: {
            gold: 50,
        },
        produces: [crossbow, dagger, longbow, sword, khopesh, poisonedDagger],
    }],
};
export default weaponsmith;
