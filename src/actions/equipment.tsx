import { Structure, ProductionDefinition } from 'src/definitions/structures';

export enum ActionType {
    craft = "craft",
    increaseWorkers = "increaseWorkers",
    decreaseWorkers = "decreaseWorkers"
}

export interface Action {
    type:ActionType,
    productionDefinition:ProductionDefinition
}

export function craft(productionDefinition:ProductionDefinition): Action {
    console.log("Crafting " + productionDefinition.equipment + " now!");
    return {
        type: ActionType.craft,
        productionDefinition
    }
}
