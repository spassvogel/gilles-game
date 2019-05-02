// tslint:disable:object-literal-sort-keys

import {  StructureType, WarehousetructureDefinition } from "./types";

const warehouse: WarehousetructureDefinition = {
    goldCost: 40,
    buildTime: 4000,
    type: StructureType.warehouse,
    levels: [{
        displayName: "structure-warehouse-name",
        // level 1:
        workerCapacity: 2,
        cost: 0,
    }, {
        // level 2:
        displayName: "structure-warehouse-name",
        workerCapacity: 5,
        cost: 30,
    }, {
        // level 3:
        displayName: "structure-warehouse-name",
        workerCapacity: 10,
        cost: 50,
    }],
};

export default warehouse;
