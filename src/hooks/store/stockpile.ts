
import { type StoreState } from 'store/types'
import { useSelector } from 'react-redux'
import { type StockpileStoreState } from 'store/types/stockpile'
import { useMemo } from 'react'
import { type Item } from 'definitions/items/types'

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
