import { Equipment } from "src/definitions/equipment/types";

// tslint:disable:object-literal-sort-keys
export enum ActionType {
    moveEquipmentInInventory = "moveEquipmentInInventory",
}

export interface Action {
    type: ActionType;
    adventurerId: string;
}

export interface InventoryAction extends Action {
    equipment: Equipment;
}
export interface MoveEquipmentInInventoryAction extends Action {
    fromSlot: number;
    toSlot: number;
}

// tslint:disable-next-line:max-line-length
export function moveEquipmentInInventory(adventurerId: string, fromSlot: number, toSlot: number): MoveEquipmentInInventoryAction {
    return {
        type: ActionType.moveEquipmentInInventory,
        adventurerId,
        fromSlot,
        toSlot,
    };
}
