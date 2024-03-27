import { type Deed } from 'definitions/items/deeds'
import { type Item } from 'definitions/items/types'

export type StockpileStoreState = {
  'ammunition': Array<Item | null>
  'apparel': Array<Item | null>
  'deed': Array<Item<Deed> | null>
  'herb': Array<Item | null>
  'material': Array<Item | null>
  'mineral': Array<Item | null>
  'consumable': Array<Item | null>
  'questItem': Array<Item | null>
  'trinket': Array<Item | null>
  'weapon': Array<Item | null>
}
