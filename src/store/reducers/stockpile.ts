import { type StockpileAction } from 'store/actions/stockpile'
import { type Reducer } from 'redux'
import { type ItemType, ItemCategory, type Item } from 'definitions/items/types'
import { canStackItem, getAllItemsByCategory, getDefinition as getItemDefinition } from 'definitions/items'
import { type StockpileStoreState } from 'store/types/stockpile'
import { getDefinition } from 'definitions/structures'
import { type WarehouseStructureDefinition } from 'definitions/structures/types'

const getRandomItemTypeByCategory = (itemCategory: ItemCategory): ItemType => {
  const all = getAllItemsByCategory(itemCategory)
  const randomIndex = Math.floor(Math.random() * all.length)
  return all[randomIndex]
}

// Items in warehouse
export const getInitialStockpile = (): StockpileStoreState => {
  // Generate some random stuff
  const result: StockpileStoreState = {
    ammunition: [],
    apparel: [],
    deed: [{ type: 'deed/lumbermill' }, { type: 'deed/tavern' }],
    herb: [],
    material: [],
    mineral: [],
    consumable: [],
    questItem: [],
    trinket: [],
    weapon: []
  }

  if (process.env.NODE_ENV === 'development') {
    // uncomment to generate some random stuff to be added
    const { maxStockpile } = getDefinition<WarehouseStructureDefinition>('warehouse').levels[0]
    Object.keys(result).forEach((itemCategoryName: string) => {
      const itemCategory = ItemCategory[itemCategoryName as keyof typeof ItemCategory]
      for (let i = 0; i < maxStockpile; i++) {
        if (Math.random() < 0.5) {
          result[itemCategoryName as keyof typeof result].push(null)
        } else {
          const randomItem: Item = { type: getRandomItemTypeByCategory(itemCategory) }
          if (canStackItem(itemCategory)) {
            randomItem.quantity = Math.floor(Math.random() * 100)
          }
          const category = result[itemCategoryName as keyof typeof result] as Item[]
          category.push(randomItem)
        }
      }
    })
  }
  return result
}

// const getRandomItem = (): ItemType => {
//   const all = Object.keys(allItems)
//   const randomIndex = Math.floor(Math.random() * all.length)
//   return all[randomIndex] as ItemType
// }

/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const stockpile: Reducer<StockpileStoreState, StockpileAction> = (state = getInitialStockpile(), action) => {
  switch (action.type) {
    case 'addItem': {
      const definition = getItemDefinition(action.item.type)
      // toSlot is optional
      const { item } = action
      let { toSlot } = (action)
      const stockpileCategory = ItemCategory[definition.itemCategory] as keyof StockpileStoreState

      if (toSlot === undefined) {
        toSlot = state[stockpileCategory].findIndex((slot) => slot === null) // find first empty element
        if (toSlot === -1) {
          // Still not found. Add at end
          // todo: [07/07/2019] GAME DESIGN
          return {
            ...state,
            [stockpileCategory]: [
              ...state[stockpileCategory],
              item
            ]
          }
        }
      }
      return {
        ...state,
        [stockpileCategory]: state[stockpileCategory].map((element, index) => index === toSlot ? item : element)
      }
    }

    case 'moveItemInWarehouse': {
      const {
        itemCategory,
        fromSlot,
        toSlot
      } = action
      const stockpileCategory = ItemCategory[itemCategory] as keyof StockpileStoreState

      return {
        ...state,
        [stockpileCategory]: state[stockpileCategory].map((element, index) => {
          if (index === fromSlot) { return state[stockpileCategory][toSlot] }
          if (index === toSlot) { return state[stockpileCategory][fromSlot] }
          return element
        })
      }
    }
    case 'removeItem': {
      const { itemCategory, fromSlot } = action
      const stockpileCategory = ItemCategory[itemCategory] as keyof StockpileStoreState

      return {
        ...state,
        [stockpileCategory]: state[stockpileCategory].map((element, index) => index !== fromSlot ? element : null)
      }
    }

    // // Adds slots with 'null' to the end
    // case ActionType.addStockpileSlots: {
    //   const {
    //     slots,
    //   } = (action as AddStockpileSlotsAction)

    //   return [
    //     ...state,
    //     ...Array(slots).fill(null)
    //   ];
    // }
  }

  return state
}
