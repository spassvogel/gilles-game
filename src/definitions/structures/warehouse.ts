import { FOUR_MINUTES, TWO_MINUTES } from 'utils/format/time';
import {  StructureType, WarehouseStructureDefinition } from "./types";

const warehouse: WarehouseStructureDefinition = {
    cost: {
        gold: 40,
        time: 4000,
    },
    type: StructureType.warehouse,
    levels: [{
        displayName: "structure-warehouse-name",
        // level 1:
        workerCapacity: 2,
        cost: {
            gold: 0,
        },
        maxResources: {
            fabric: 200,
            food: 200,
            iron: 200,
            leather: 200,
            stone: 200,
            wood: 200,
        },
        maxStockpile: 16
    }, {
        // level 2:
        displayName: "structure-warehouse-name",
        workerCapacity: 5,
        cost: {
            gold: 13,
            resources: {
                wood: 100,
                iron: 100,
                stone: 100
            },
            time: FOUR_MINUTES
        },
        maxResources: {
            fabric: 500,
            food: 500,
            iron: 500,
            leather: 500,
            stone: 500,
            wood: 500,
        },
        maxStockpile: 32
    }, {
        // level 3:
        displayName: "structure-warehouse-name",
        workerCapacity: 10,
        cost: {
            gold: 50,
            time: TWO_MINUTES * 5
        },
        maxResources: {
            fabric: 1000,
            food: 1000,
            iron: 1000,
            leather: 1000,
            stone: 1000,
            wood: 1000,
        },
        maxStockpile: 48
    }],
};

export default warehouse;
