import { Item } from "definitions/items/types";
import { Action } from "redux";

// todo: refactor using discriminatd union
export enum ActionType {
    addItem = "addItem",
    moveItemInWarehouse = "moveItemInWarehouse",
    removeItem = "removeItem",
    addStockpileSlots = "addStockpileSlots"
}

export interface MoveItemInWarehouseAction extends Action<ActionType> {
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
export interface AddStockpileSlotsAction extends Action {
    slots: number;
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

export function addStockpileSlots(slots: number): AddStockpileSlotsAction {
    return {
        type: ActionType.addStockpileSlots,
        slots,
    };
}
