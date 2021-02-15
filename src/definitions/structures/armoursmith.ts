// tslint:disable:object-literal-sort-keys

import { ProductionStructureDefinition, StructureType } from "./types";
import { Item } from 'definitions/items/types';
import { ONE_MINUTE, TWO_MINUTES } from 'utils/format/time';

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
        unlocks: [Item.boots1 ],
    }, {
        // level 2:
        displayName: "structure-armoursmith-name",
        workerCapacity: 5,
        cost: {
            gold: 30,
            time: ONE_MINUTE
        },
        unlocks: [Item.chest ],
    }, {
        // level 3:
        displayName: "structure-armoursmith-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
            time: TWO_MINUTES
        },
        unlocks: [Item.cowl],
    }],
};
export default armoursmith;
