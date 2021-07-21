
import { ItemAction } from "store/actions/items";
import { Reducer } from "redux";
import { Item, ItemType } from "definitions/items/types";
import allItems, { getAllItemsByType } from "definitions/items";
import { StockpileStoreState } from "store/types/stockpile";
import { getDefinition } from "definitions/structures";
import { WarehouseStructureDefinition } from "definitions/structures/types";

// Items in warehouse
export const getInitialStockpile = (): StockpileStoreState => {
    // Generate some random stuff
    const result: StockpileStoreState = {
        "apparel": [],
        "deed": [],
        "herb": [],
        "material": [],
        "mineral": [],
        "potion": [],
        "questItem": [],
        "trinket": [],
        "weapon": [],
    };
    const { maxStockpile } = getDefinition<WarehouseStructureDefinition>("warehouse").levels[0];
    Object.keys(result).forEach((itemTypeName: string) => {
        const itemType = ItemType[itemTypeName as keyof typeof ItemType];
        for (let i = 0; i < maxStockpile; i++) {
            if (Math.random() < .5) {
                result[itemTypeName as keyof typeof result].push(null)
            } else {
                const randomItem = getRandomItemOfType(itemType);
                result[itemTypeName as keyof typeof result].push(randomItem);
            }
        }
    })
    return result;
}

const getRandomItem = (): Item => {
    const all = Object.keys(allItems)
    const randomIndex = Math.floor(Math.random() * all.length);
    return all[randomIndex] as Item; 
}

const getRandomItemOfType = (itemType: ItemType): Item => {
    const all = getAllItemsByType(itemType)
    const randomIndex = Math.floor(Math.random() * all.length);
    return all[randomIndex] as Item; 
}

/**
 * reducer
 * @param state
 * @param action
 */
export const stockpile: Reducer<StockpileStoreState, ItemAction> = (state = getInitialStockpile(), action: ItemAction) => {
    // switch (action.type) {
    //     case "addItem": {
    //         // // toSlot is optional
    //         // const { item } = action;
    //         // let { toSlot } = (action);
    //         // if (toSlot === undefined) {
    //         //     toSlot = state.findIndex((slot) => slot === null);  // find first empty element
    //         //     if (toSlot === -1) {
    //         //         // Still not found. Add at end
    //         //         // todo: [07/07/2019] GAME DESIGN
    //         //         return [ ...state, item ];
    //         //     }
    //         // }
    //         // return state.map((element, index) => index === toSlot ? item : element);
    //     }

    //     case "moveItemInWarehouse": {
    //         // const {
    //         //     fromSlot,
    //         //     toSlot,
    //         // } = action;

    //         // return state.map((element, index) => {
    //         //     if (index === fromSlot) { return state[toSlot]; }
    //         //     if (index === toSlot) { return state[fromSlot]; }
    //         //     return element;
    //         // });
    //     }
    //     case "removeItem": {
    //         // const { fromSlot } = action;

    //         // return state.map((element, index) => index !== fromSlot ? element : null);
    //     }

    //     // // Adds slots with 'null' to the end
    //     // case ActionType.addStockpileSlots: {
    //     //     const {
    //     //         slots,
    //     //     } = (action as AddStockpileSlotsAction);

    //     //     return [
    //     //         ...state,
    //     //         ...Array(slots).fill(null)
    //     //     ];
    //     // }
    // }

    return state;
};
