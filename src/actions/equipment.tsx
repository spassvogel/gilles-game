// tslint:disable:object-literal-sort-keys
// OBSOLETE
import { Item } from "src/definitions/items/types";
import { ProductionDefinition } from "src/definitions/production/types";

export enum ActionType {
    craft = "craft",
    addEquipment = "addEquipment",
}

export interface Action {
    type: ActionType;
}

export interface CraftAction extends Action {
    productionDefinition: ProductionDefinition;
}

export interface AddAction extends Action {
    equipment: Item;
}

// Starts crafting (todo: maybe may not be necesary)
export function craft(productionDefinition: ProductionDefinition): CraftAction {
    return {
        type: ActionType.craft,
        productionDefinition,
    };
}

// Adds one equipment to the storehouse
export function addEquipment(equipment: Item): AddAction {
    return {
        type: ActionType.addEquipment,
        equipment,
    };
}
