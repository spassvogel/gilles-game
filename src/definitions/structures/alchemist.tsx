// tslint:disable:object-literal-sort-keys
import { ProductionStructureDefinition, StructureType } from "./types";
const alchemist: ProductionStructureDefinition = {
    type: StructureType.production,
    goldCost: 40,
    buildTime: 4000,
    levels: [{
        displayName: "structure-alchemist-name",
        // level 1:
        workerCapacity: 2,
        cost: 0,
        produces: [],
    }, {
        // level 2:
        displayName: "structure-alchemist-name",
        workerCapacity: 5,
        cost: 30,
        produces: [],
    }, {
        // level 3:
        displayName: "structure-alchemist-name",
        workerCapacity: 10,
        cost: 50,
        produces: [],
    }],
};

export default alchemist;
