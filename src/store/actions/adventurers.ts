import { EquipmentSlotType } from "components/ui/adventurer/EquipmentSlot";
import { Item } from "definitions/items/types";

export type AdventurerAction = 
    { type: "moveItemInInventory", adventurerId: string, fromSlot: number, toSlot: number }
 |  { type: "moveItemToOtherAdventurer", adventurerId: string, fromSlot: number, toSlot?: number, toAdventurerId: string }
 |  { type: "addItemToInventory", adventurerId: string, item: Item, toSlot?: number }
 |  { type: "removeItemFromInventory", adventurerId: string, fromSlot: number }
 |  { type: "assignEquipment", adventurerId: string, item: Item, equipmentSlot: EquipmentSlotType }
 |  { type: "removeEquipment", adventurerId: string, equipmentSlot: EquipmentSlotType }
 |  { type: "renameAdventurer", adventurerId: string, name: string }
 |  { type: "addXP", adventurerId: string, xp: number; }
//drinkPotion

export const moveItemInInventory = (adventurerId: string, fromSlot: number, toSlot: number): AdventurerAction => ({
    type: "moveItemInInventory",
    adventurerId,
    fromSlot,
    toSlot,
})

/**
 * Moves the an item from one adventurers' inventory to another
 * @param fromAdventurerId adventurer whose inventory to take the item from
 * @param fromSlot index of the inventory item
 * @param toAdventurerId player who to give the item to
 */
export const moveItemToOtherAdventurer = (fromAdventurerId: string, fromSlot: number, toAdventurerId: string, toSlot?: number): AdventurerAction => ({
    type: "moveItemToOtherAdventurer",
    adventurerId: fromAdventurerId,
    fromSlot,
    toAdventurerId,
    toSlot,
})

// If slot is not provided, will take the first empty slot
export const addItemToInventory = (adventurerId: string, item: Item, toSlot?: number): AdventurerAction => ({
    type: "addItemToInventory",
    adventurerId,
    item,
    toSlot,
})

export const removeItemFromInventory = (adventurerId: string, fromSlot: number): AdventurerAction => ({
    type: "removeItemFromInventory",
    adventurerId,
    fromSlot,
})

export const assignEquipment = (adventurerId: string, equipmentSlot: EquipmentSlotType, item: Item): AdventurerAction => ({
    type: "assignEquipment",
    adventurerId,
    item,
    equipmentSlot,
})

export const removeEquipment = (adventurerId: string, equipmentSlot: EquipmentSlotType): AdventurerAction => ({
    type: "removeEquipment",
    adventurerId,
    equipmentSlot,
})

export const renameAdventurer = (adventurerId: string, name: string): AdventurerAction => ({
    type: "renameAdventurer",
    adventurerId,
    name,
})

export const addXp = (adventurerId: string, xp: number): AdventurerAction => ({
    type: "addXP",
    adventurerId,
    xp,
})
