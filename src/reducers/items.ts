
import {  ActionType, AddAction, MoveItemInWarehouseAction, RemoveItemFromWarehouseAction } from "actions/items";
import { Item } from "definitions/items/types";
import { AnyAction, Reducer } from "redux";

const testState = [
    null,
    null,
    null,
    Item.dagger,
    Item.deedForWeaponsmith,
    null,
    Item.sandwich,
    Item.sandwich,
    null,
    null,
    Item.torch,
    Item.torch,
    null,
    Item.torch
];

// Items in warehouse

/**
 * reducer
 * @param state
 * @param action
 */
export const items: Reducer<Array<Item|null>> = (state: Array<Item|null> = testState,
                                                 action: AnyAction) => {
    switch (action.type) {
        case ActionType.addItem: {
            // toSlot is optional
            const { item } = (action as AddAction);
            let { toSlot } = (action as AddAction);
            if (toSlot === undefined) {
                toSlot = state.findIndex((slot) => slot === null);  // find first empty element
                if (toSlot === -1) {
                    // Still not found. Add at end
                    // todo: [07/07/2019] GAME DESIGN
                    return [ ...state, item ];
                }
            }
            return state.map((element, index) => index === toSlot ? item : element);
        }

        case ActionType.moveItemInWarehouse: {
            const {
                fromSlot,
                toSlot,
            } = (action as MoveItemInWarehouseAction);

            return state.map((element, index) => {
                // todo: items switch places
                if (index === fromSlot) { return null; }
                if (index === toSlot) { return state[fromSlot]; }
                return element;
            });
        }
        case ActionType.removeItem: {
            const { fromSlot } = (action as RemoveItemFromWarehouseAction);

            return state.map((element, index) => index !== fromSlot ? element : null);
        }
    }

    return state;
};
