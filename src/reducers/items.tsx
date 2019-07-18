
import { Reducer } from "redux";
import { GameTickAction } from "actions/game";
import { Action, ActionType, AddAction, MoveItemInWarehouseAction, RemoveItemFromWarehouseAction } from "actions/items";
import { Item } from "definitions/items/types";

const testState = [
    null,
    null,
    null,
    Item.dagger,
    Item.deedForWeaponsmith,
];

// Items in warehouse

/**
 * reducer
 * @param state
 * @param action
 */
export const items: Reducer<Array<Item|null>> = (state: Array<Item|null> = testState,
                                                 action: Action| GameTickAction) => {
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
