// tslint:disable:object-literal-sort-keys

import {  StructureType, WarehousetructureDefinition } from "./types";

const warehouse: WarehousetructureDefinition = {
    goldCost: 40,
    buildTime: 4000,
    type: StructureType.warehouse,
    levels: [{
        displayName: "Shed",
        // level 1:
        workerCapacity: 2,
        cost: 0,
    }, {
        // level 2:
        displayName: "Warehouse",
        workerCapacity: 5,
        cost: 30,
    }, {
        // level 3:
        displayName: "Vault",
        workerCapacity: 10,
        cost: 50,
    }],
};

export default warehouse;
