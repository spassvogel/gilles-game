import { ItemType, ItemCategory } from "definitions/items/types";
import { Action } from "redux";

export type StockpileAction =
  { type: "addItem", item: ItemType, toSlot?: number }
| { type: "moveItemInWarehouse", itemCategory: ItemCategory, fromSlot: number, toSlot: number }
| { type: "removeItem", itemCategory: ItemCategory, fromSlot: number }
//  |  { type: "addStockpileSlots"



export interface AddStockpileSlotsAction extends Action {
  slots: number;
}

// Adds one Item to the warehouse
// slot is optional, will take the first empty slot if not provided
export const addItemToWarehouse = (item: ItemType, toSlot?: number): StockpileAction => {
  return {
    type: "addItem",
    item,
    toSlot,
  };
}

// When an Item is moved from one slot to the other in the warehouse
export const moveItemInWarehouse = (itemCategory: ItemCategory, fromSlot: number, toSlot: number): StockpileAction => {
  return {
    type: "moveItemInWarehouse",
    itemCategory,
    fromSlot,
    toSlot,
  };
}

export const removeItemFromWarehouse = (itemCategory: ItemCategory, fromSlot: number): StockpileAction => {
  return {
    type: "removeItem",
    itemCategory,
    fromSlot,
  };
}

// export function addStockpileSlots(slots: number): AddStockpileSlotsAction {
//   return {
//     type: ActionType.addStockpileSlots,
//     slots,
//   };
// }
