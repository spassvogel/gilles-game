// tslint:disable:object-literal-sort-keys

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
    equipment: string;
}

// Starts crafting (todo: maybe may not be necesary)
export function craft(productionDefinition: ProductionDefinition): CraftAction {
    return {
        type: ActionType.craft,
        productionDefinition,
    };
}

// Adds one equipment to the storehouse
export function addEquipment(equipment: string): AddAction {
    return {
        type: ActionType.addEquipment,
        equipment,
    };
}
