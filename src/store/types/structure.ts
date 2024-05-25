import { type Apparel } from 'definitions/items/apparel'
import { type QuestItem } from 'definitions/items/questItems'
import { type Item } from 'definitions/items/types'
import { type Weapon } from 'definitions/items/weapons'

export enum StructureState {
  NotBuilt,
  Building,
  Built,
}

export type StructureStoreState = {
  level: number
  workers: number
  state: StructureState
}

export type ProducableItem = Weapon | Apparel | QuestItem

export type ProductionStructureStoreState = {
  produces: ProducableItem[]
} & StructureStoreState

export type ResourceStructureState = {
  harvest?: Item[] // Items currently available for harvest at this structure
} & StructureStoreState

export type TavernLodging = {
  adventurer: string
  paidUntil: number
}

export type TavernStructureState = {
  lodging: Array<TavernLodging | null>
  waiting: Array<string | null> // contains adventurer ids
  nextAdventurersArrive: number
} & StructureStoreState
