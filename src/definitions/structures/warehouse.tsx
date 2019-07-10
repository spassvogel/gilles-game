// tslint:disable:object-literal-sort-keys

import {  StructureType, WarehouseStructureDefinition } from "./types";

const warehouse: WarehouseStructureDefinition = {
    goldCost: 40,
    buildTime: 4000,
    type: StructureType.warehouse,
    levels: [{
        displayName: "structure-warehouse-name",
        // level 1:
        workerCapacity: 2,
        cost: 0,
        maxResources: {
            fabric: 200,
            food: 200,
            gunpowder: 200,
            iron: 200,
            leather: 200,
            stone: 200,
            wood: 200,
        },
    }, {
        // level 2:
        displayName: "structure-warehouse-name",
        workerCapacity: 5,
        cost: 30,
        maxResources: {
            fabric: 500,
            food: 500,
            gunpowder: 500,
            iron: 500,
            leather: 500,
            stone: 500,
            wood: 500,
        },
    }, {
        // level 3:
        displayName: "structure-warehouse-name",
        workerCapacity: 10,
        cost: 50,
        maxResources: {
            fabric: 1000,
            food: 1000,
            gunpowder: 1000,
            iron: 1000,
            leather: 1000,
            stone: 1000,
            wood: 1000,
        },
    }],
};

export default warehouse;
