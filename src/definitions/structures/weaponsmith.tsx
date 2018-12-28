// tslint:disable:object-literal-sort-keys

import { crossbow, dagger, khopesh, longbow, sword } from "../production/weapons";
import { ProductionStructureDefinition, StructureType } from "./types";

const weaponsmith: ProductionStructureDefinition = {
    type: StructureType.production,
    goldCost: 40,
    buildTime: 4000,
    levels: [{
        // level 1:
        displayName: "Weaponsmith",
        workerCapacity: 2,
        cost: 0,
        produces: [crossbow, dagger],
    }, {
        // level 2:
        displayName: "Weaponsmith",
        workerCapacity: 5,
        cost: 30,
        produces: [crossbow, dagger, longbow],
    }, {
        // level 3:
        displayName: "Weaponsmith",
        workerCapacity: 10,
        cost: 50,
        produces: [crossbow, dagger, longbow, sword, khopesh],
    }],
};
export default weaponsmith;
