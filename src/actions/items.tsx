import { Item } from "src/definitions/items/types";

// tslint:disable:object-literal-sort-keys
export enum ActionType {
    addItem = "addItem",
    moveItemInWarehouse = "moveItemInWarehouse",
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
}

// Adds one Item to the warehouse
export function addItem(item: Item): AddAction {
    return {
        type: ActionType.addItem,
        item,
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
