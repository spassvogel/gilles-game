import { type Item, type ItemType } from 'definitions/items/types'
import { type ResourceStoreState } from 'store/types/resources'

export type CostStoreState = {
  gold?: number
  time?: number
  resources?: ResourceStoreState
  materials?: ItemType[]
}

export type ProductionDefinition = {
  item: Item
  cost: CostStoreState
  levelRequired?: number
}
