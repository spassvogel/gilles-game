// tslint:disable:object-literal-sort-keys

import { crossbow, dagger, khopesh, longbow, poisionedDagger, sword } from "../production/weapons";
import { ProductionStructureDefinition, StructureType } from "./types";

const weaponsmith: ProductionStructureDefinition = {
    type: StructureType.production,
    goldCost: 40,
    buildTime: 4000,
    levels: [{
        // level 1:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 2,
        cost: 0,
        produces: [crossbow, dagger],
    }, {
        // level 2:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 5,
        cost: 30,
        produces: [crossbow, dagger, longbow],
    }, {
        // level 3:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 10,
        cost: 50,
        produces: [crossbow, dagger, longbow, sword, khopesh],
    }, {
        // level 4:
        displayName: "structure-weaponsmith-name",
        workerCapacity: 14,
        cost: 50,
        produces: [crossbow, dagger, longbow, sword, khopesh, poisionedDagger],
    }],
};
export default weaponsmith;
