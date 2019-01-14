
import { Reducer } from "redux";
import { GameTickAction } from "src/actions/game";
import { Action, ActionType, MoveItemInWarehouseAction } from "src/actions/items";
import { Item } from "src/definitions/items/types";

const testState = [
    null,
    null,
    null,
    Item.dagger,
];

/**
 * reducer
 * @param state
 * @param action
 */
export const items: Reducer<Array<Item|null>> = (state: Array<Item|null> = testState,
                                                 action: Action| GameTickAction) => {
    switch (action.type) {
        case ActionType.moveItemInWarehouse:
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
    return state;
};
