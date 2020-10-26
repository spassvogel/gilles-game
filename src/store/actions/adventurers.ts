import { EquipmentSlotType } from "components/ui/adventurer/EquipmentSlot";
import { Item } from "definitions/items/types";
import { Action } from "redux";

// tslint:disable:object-literal-sort-keys
export enum ActionType {
    moveItemInInventory = "moveItemInInventory",
    moveItemToOtherAdventurer = "moveItemToOtherAdventurer",
    moveItemFromWarehouseToAdventurer = "moveItemFromWarehouseToAdventurer",
    addItemToInventory = "addItemToInventory",
    removeItemFromInventory = "removeItemFromInventory",
    assignEquipment = "assignEquipment",
    removeEquipment = "removeEquipment",
}

export interface AdventurerAction extends Action<ActionType> {
    adventurerId: string;
}

export interface InventoryAction extends AdventurerAction {
    item: Item;
    toSlot?: number;
}

export interface MoveItemInInventoryAction extends AdventurerAction {
    fromSlot: number;
    toSlot: number;
}

export interface RemoveItemFromInventoryAction extends AdventurerAction {
    fromSlot: number;
}

export interface MoveItemToOtherAdventurerAction extends AdventurerAction {
    fromSlot: number;
    toSlot?: number;
    toAdventurerId: string;
}

export interface AssignEquipmentAction extends AdventurerAction {
    item: Item;
    equipmentSlot: EquipmentSlotType;
}
export interface RemoveEquipmentAction extends AdventurerAction {
    equipmentSlot: EquipmentSlotType;
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

export function assignEquipment(adventurerId: string, equipmentSlot: EquipmentSlotType, item: Item): AssignEquipmentAction {
    return {
        type: ActionType.assignEquipment,
        adventurerId,
        item,
        equipmentSlot,
    };
}

export function removeEquipment(adventurerId: string, equipmentSlot: EquipmentSlotType): RemoveEquipmentAction {
    return {
        type: ActionType.removeEquipment,
        adventurerId,
        equipmentSlot,
    };
}
