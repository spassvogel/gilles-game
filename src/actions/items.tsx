import { Item } from "src/definitions/items/types";

// tslint:disable:object-literal-sort-keys
export enum ActionType {
    addItem = "addItem",
    moveItemInWarehouse = "moveItemInWarehouse",
    removeItem = "removeItem",
}

export interface Action {
    type: ActionType;
}

export interface MoveItemInWarehouseAction extends Action {
    fromSlot: number;
    toSlot: number;
}

export interface AddAction extends Action {
    item: Item;
    toSlot?: number;
}

export interface RemoveItemFromWarehouseAction extends Action {
    fromSlot: number;
}


// Adds one Item to the warehouse
// slot is optional, will take the first empty slot if not provided
export function addItemToWarehouse(item: Item, toSlot?: number): AddAction {
    return {
        type: ActionType.addItem,
        item,
        toSlot,
    };
}

// When an Item is moved from one slot to the other in the warehouse
export function moveItemInWarehouse(fromSlot: number, toSlot: number): MoveItemInWarehouseAction {
    return {
        type: ActionType.moveItemInWarehouse,
        fromSlot,
        toSlot,
    };
}
export function removeItemFromWarehouse(fromSlot: number): RemoveItemFromWarehouseAction {
    return {
        type: ActionType.removeItem,
        fromSlot,
    };
}
