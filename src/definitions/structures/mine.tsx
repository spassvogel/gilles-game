// tslint:disable:object-literal-sort-keys
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
        cost: 0,
        generates: { iron: 2 },
    }, {
        displayName: "structure-mine-name",
        // level 1:
        workerCapacity: 5,
        cost: 30,
        generates: { iron: 2 },
    }, {
        displayName: "structure-mine-name",
        // level 2:
        workerCapacity: 10,
        cost: 50,
        generates: { iron: 2 },
    }],
};
export default mine;
