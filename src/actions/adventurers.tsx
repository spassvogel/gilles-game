import { Item } from "src/definitions/items/types";

// tslint:disable:object-literal-sort-keys
export enum ActionType {
    moveItemInInventory = "moveItemInInventory",
    moveItemToOtherAdventurer = "moveItemToOtherAdventurer",
    moveItemFromWarehouseToAdventurer = "moveItemFromWarehouseToAdventurer",
    adventurerPicksUpItem = "adventurerPicksUpItem",
}

export interface Action {
    type: ActionType;
    adventurerId: string;
}

export interface InventoryAction extends Action {
    item: Item;
}
export interface MoveItemInInventoryAction extends Action {
    fromSlot: number;
    toSlot: number;
}
export interface MoveItemInToOtherAdventurerAction extends Action {
    fromSlot: number;
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
export function moveItemToOtherAdventurer(fromAdventurerId: string, fromSlot: number, toAdventurerId: string):
    MoveItemInToOtherAdventurerAction {
    return {
        type: ActionType.moveItemToOtherAdventurer,
        adventurerId: fromAdventurerId,
        fromSlot,
        toAdventurerId,
    };
}

/**
 * Moves item from warehouse to adventurer
 */
export function moveItemFromWarehouseToAdventurer(adventurerId: string, item: Item): InventoryAction {
    return {
        type: ActionType.moveItemFromWarehouseToAdventurer,
        adventurerId,
        item,
    };
}
export function adventurerPicksUpItem(adventurerId: string, item: Item): InventoryAction {
    return {
        type: ActionType.adventurerPicksUpItem,
        adventurerId,
        item,
    };
}
