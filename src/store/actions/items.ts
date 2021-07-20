import { Item } from "definitions/items/types";
import { Action } from "redux";

export type ItemAction =
    { type: "addItem", item: Item, toSlot?: number }
 |  { type: "moveItemInWarehouse", fromSlot: number, toSlot: number }
 |  { type: "removeItem", fromSlot: number }
//  |  { type: "addStockpileSlots"



export interface AddStockpileSlotsAction extends Action {
    slots: number;
}

// Adds one Item to the warehouse
// slot is optional, will take the first empty slot if not provided
export const addItemToWarehouse = (item: Item, toSlot?: number): ItemAction => {
    return {
        type: "addItem",
        item,
        toSlot,
    };
}

// When an Item is moved from one slot to the other in the warehouse
export const moveItemInWarehouse = (fromSlot: number, toSlot: number): ItemAction => {
    return {
        type: "moveItemInWarehouse",
        fromSlot,
        toSlot,
    };
}

export const removeItemFromWarehouse = (fromSlot: number): ItemAction => {
    return {
        type: "removeItem",
        fromSlot,
    };
}

// export function addStockpileSlots(slots: number): AddStockpileSlotsAction {
//     return {
//         type: ActionType.addStockpileSlots,
//         slots,
//     };
// }
