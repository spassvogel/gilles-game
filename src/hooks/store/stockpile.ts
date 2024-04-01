import { type StoreState } from 'store/types'
import { useSelector } from 'react-redux'
import { type StockpileStoreState } from 'store/types/stockpile'
import { useMemo } from 'react'
import { type ItemType, type Item } from 'definitions/items/types'

// Returns the stockpile of items grouped into itemCategory
export const useStockpileState = () => {
  return useSelector<StoreState, StockpileStoreState>(state => state.stockpile)
}

export const useStockpileStateFlat = (): Array<Item | null> => {
  const stockpile = useStockpileState()
  return useMemo(() => {
    const all = Object.values(stockpile).flat()
    return all
  }, [stockpile])
}

/** Returns a boolean indicating whether there are enough items in stockpile for provided `items` */
// todo: what if we want to require 2 of the same type...
export const useEnoughMaterials = (items: ItemType[]) => {
  const stockpileState = useStockpileStateFlat()
  return useMemo(() => {
    return !items.some((iT: ItemType) => stockpileState.find(i => i != null && i.type === iT))
  }, [items, stockpileState])
}
