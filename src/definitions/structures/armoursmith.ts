// tslint:disable:object-literal-sort-keys

import { boots1, chest, cowl } from "../production/armour";
import { ProductionStructureDefinition, StructureType } from "./types";

const armoursmith: ProductionStructureDefinition = {
    cost: {
        gold: 40,
        time: 4000,
    },
    type: StructureType.production,
    levels: [{
        // level 1:
        displayName: "structure-armoursmith-name",
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        produces: [ boots1 ],
    }, {
        // level 2:
        displayName: "structure-armoursmith-name",
        workerCapacity: 5,
        cost: {
            gold: 30,
        },
        produces: [ boots1, chest ],
    }, {
        // level 3:
        displayName: "structure-armoursmith-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
        },
        produces: [ boots1, chest, cowl],
    }],
};
export default armoursmith;
