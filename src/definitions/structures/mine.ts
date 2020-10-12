// tslint:disable:object-literal-sort-keys
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
    }, {
        displayName: "structure-mine-name",
        // level 1:
        workerCapacity: 5,
        cost: {
            gold: 30,
            time: ONE_MINUTE
        },
        generates: { iron: 2 },
    }, {
        displayName: "structure-mine-name",
        // level 2:
        workerCapacity: 10,
        cost: {
            gold: 50,
            time: TWO_MINUTES
        },
        generates: { iron: 2 },
    }],
};
export default mine;
