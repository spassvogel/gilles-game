
import { StockpileAction } from "store/actions/stockpile";
import { Reducer } from "redux";
import { Item, ItemType } from "definitions/items/types";
import allItems, { getAllItemsByType } from "definitions/items";
import { StockpileStoreState } from "store/types/stockpile";
import { getDefinition } from "definitions/structures";
import { getDefinition as getItemDefinition } from "definitions/items";
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
    "consumable": [],
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
        result[itemTypeName as keyof typeof result].push(randomItem as any);
      }
    }
  })
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
export const stockpile: Reducer<StockpileStoreState, StockpileAction> = (state = getInitialStockpile(), action) => {
  switch (action.type) {
    case "addItem": {
      const definition = getItemDefinition(action.item)
      // toSlot is optional
      const { item } = action;
      let { toSlot } = (action);
      const stockpileCategory = ItemType[definition.itemType] as keyof StockpileStoreState

      if (toSlot === undefined) {
        toSlot = state[stockpileCategory].findIndex((slot) => slot === null);  // find first empty element
        if (toSlot === -1) {
          // Still not found. Add at end
          // todo: [07/07/2019] GAME DESIGN
          return {
            ...state,
            [stockpileCategory]: [
              ...state[stockpileCategory],
              item
            ]
          };
        }
      }
      return {
        ...state,
        [stockpileCategory]: state[stockpileCategory].map((element, index) => index === toSlot ? item : element)
      };
    }

    case "moveItemInWarehouse": {
      const {
        itemType,
        fromSlot,
        toSlot,
      } = action;
      const stockpileCategory = ItemType[itemType] as keyof StockpileStoreState

      return {
        ...state,
        [stockpileCategory]: state[stockpileCategory].map((element, index) => {
          if (index === fromSlot) { return state[stockpileCategory][toSlot]; }
          if (index === toSlot) { return state[stockpileCategory][fromSlot]; }
          return element;
        })
      };
    }
    case "removeItem": {
      const { itemType, fromSlot } = action;
      const stockpileCategory = ItemType[itemType] as keyof StockpileStoreState

        return {
        ...state,
        [stockpileCategory]: state[stockpileCategory].map((element, index) => index !== fromSlot ? element : null)
      };
    }

    // // Adds slots with 'null' to the end
    // case ActionType.addStockpileSlots: {
    //   const {
    //     slots,
    //   } = (action as AddStockpileSlotsAction);

    //   return [
    //     ...state,
    //     ...Array(slots).fill(null)
    //   ];
    // }
  }

  return state;
};
