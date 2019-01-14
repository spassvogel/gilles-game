import { Item } from "src/definitions/items/types";

// tslint:disable:object-literal-sort-keys
export enum ActionType {
    moveItemInWarehouse = "moveItemInWarehouse",
}

export interface Action {
    type: ActionType;
}

export interface MoveItemInWarehouseAction extends Action {
    fromSlot: number;
    toSlot: number;
}

export function moveItemInWarehouse(fromSlot: number, toSlot: number): MoveItemInWarehouseAction {
    return {
        type: ActionType.moveItemInWarehouse,
        fromSlot,
        toSlot,
    };
}
