// tslint:disable:object-literal-sort-keys
import { ResourceStructureDefinition, StructureType } from "./types";

const mine: ResourceStructureDefinition = {
    type: StructureType.resource,
    levels: [{
        displayName: "Hole in the rocky ground",
        // level 0:
        workerCapacity: 2,
        cost: 0,
        generates: { iron: 2 },
    }, {
        displayName: "A small mine",
        // level 1:
        workerCapacity: 5,
        cost: 30,
        generates: { iron: 2 },
    }, {
        displayName: "A large mine",
        // level 2:
        workerCapacity: 10,
        cost: 50,
        generates: { iron: 2 },
    }],
};
export default mine;