import { Item, ItemType } from "definitions/items/types";
import { Action } from "redux";

export type StockpileAction =
  { type: "addItem", item: Item, toSlot?: number }
| { type: "moveItemInWarehouse", itemType: ItemType, fromSlot: number, toSlot: number }
| { type: "removeItem", itemType: ItemType, fromSlot: number }
//  |  { type: "addStockpileSlots"



export interface AddStockpileSlotsAction extends Action {
  slots: number;
}

// Adds one Item to the warehouse
// slot is optional, will take the first empty slot if not provided
export const addItemToWarehouse = (item: Item, toSlot?: number): StockpileAction => {
  return {
    type: "addItem",
    item,
    toSlot,
  };
}

// When an Item is moved from one slot to the other in the warehouse
export const moveItemInWarehouse = (itemType: ItemType, fromSlot: number, toSlot: number): StockpileAction => {
  return {
    type: "moveItemInWarehouse",
    itemType,
    fromSlot,
    toSlot,
  };
}

export const removeItemFromWarehouse = (itemType: ItemType, fromSlot: number): StockpileAction => {
  return {
    type: "removeItem",
    itemType,
    fromSlot,
  };
}

// export function addStockpileSlots(slots: number): AddStockpileSlotsAction {
//   return {
//     type: ActionType.addStockpileSlots,
//     slots,
//   };
// }
