import { Item } from "definitions/items/types";

// tslint:disable:object-literal-sort-keys
export enum ActionType {
    moveItemInInventory = "moveItemInInventory",
    moveItemToOtherAdventurer = "moveItemToOtherAdventurer",
    moveItemFromWarehouseToAdventurer = "moveItemFromWarehouseToAdventurer",
    addItemToInventory = "addItemToInventory",
    removeItemFromInventory = "removeItemFromInventory",
}

export interface Action {
    type: ActionType;
    adventurerId: string;
}

export interface InventoryAction extends Action {
    item: Item;
    toSlot?: number;
}

export interface MoveItemInInventoryAction extends Action {
    fromSlot: number;
    toSlot: number;
}

export interface RemoveItemFromInventoryAction extends Action {
    fromSlot: number;
}

export interface MoveItemToOtherAdventurerAction extends Action {
    fromSlot: number;
    toSlot?: number;
    toAdventurerId: string;
}

export function moveItemInInventory(adventurerId: string, fromSlot: number, toSlot: number):
    MoveItemInInventoryAction {
    return {
        type: ActionType.moveItemInInventory,
        adventurerId,
        fromSlot,
        toSlot,
    };
}

/**
 * Moves the an item from one adventurers' inventory to another
 * @param fromAdventurerId adventurer whose inventory to take the item from
 * @param fromSlot index of the inventory item
 * @param toAdventurerId player who to give the item to
 */
export function moveItemToOtherAdventurer(fromAdventurerId: string,
                                          fromSlot: number,
                                          toAdventurerId: string, toSlot?: number): MoveItemToOtherAdventurerAction {
    return {
        type: ActionType.moveItemToOtherAdventurer,
        adventurerId: fromAdventurerId,
        fromSlot,
        toAdventurerId,
        toSlot,
    };
}

// If slot is not provided, will take the first empty slot
export function addItemToInventory(adventurerId: string, item: Item, toSlot?: number): InventoryAction {
    return {
        type: ActionType.addItemToInventory,
        adventurerId,
        item,
        toSlot,
    };
}

export function removeItemFromInventory(adventurerId: string, fromSlot: number): RemoveItemFromInventoryAction {
    return {
        type: ActionType.removeItemFromInventory,
        adventurerId,
        fromSlot,
    };
}
