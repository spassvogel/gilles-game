
import { ActionType, AddAction, AddStockpileSlotsAction, MoveItemInWarehouseAction, RemoveItemFromWarehouseAction } from "store/actions/items";
import { AnyAction, Reducer } from "redux";
import { getDefinition, Structure } from 'definitions/structures';
import { WarehouseStructureDefinition } from 'definitions/structures/types';
import { Item } from "definitions/items/types";

// Items in warehouse
export const getItemsInitialState = (): (Item|null)[] => {
    // Generate some random stuff
    const result: (Item|null)[] = [];
    const { maxStockpile } = getDefinition<WarehouseStructureDefinition>(Structure.warehouse).levels[0];
    for (let i = 0; i < maxStockpile; i++) {
        if (Math.random() < .5) {
            result.push(null)
        } else {
            const randomItem = getRandomItem();
            result.push(randomItem);
        }
    }
    return result;
}

const getRandomItem = (): Item => {
    return "weapon/arbalest"
    // const enumValues = (Object.values(keyof Item) as unknown) as T[keyof T][];
    // const randomIndex = Math.floor(Math.random() * enumValues.length);
    // return enumValues[randomIndex];
  
}

/**
 * reducer
 * @param state
 * @param action
 */
export const items: Reducer<(Item|null)[]> = (state: (Item|null)[] = getItemsInitialState(), action: AnyAction) => {
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

        // Adds slots with 'null' to the end
        case ActionType.addStockpileSlots: {
            const {
                slots,
            } = (action as AddStockpileSlotsAction);

            return [
                ...state,
                ...Array(slots).fill(null)
            ];
        }
    }

    return state;
};
