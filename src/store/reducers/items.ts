
import {  ActionType, AddAction, MoveItemInWarehouseAction, RemoveItemFromWarehouseAction } from "store/actions/items";
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
    Item.torch,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

// Items in warehouse

/**
 * reducer
 * @param state
 * @param action
 */
export const items: Reducer<(Item|null)[]> = (state: (Item|null)[] = testState,
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
                if (index === fromSlot) { return state[toSlot]; }
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
