import { type ItemType } from 'definitions/items/types'
import { type ResourceStoreState } from 'store/types/resources'
import { type ProducableItem } from 'store/types/structure'
import { type CostStoreState } from '../production/types'

export enum StructureType {
  resource,
  production,
  tavern,
  warehouse,
}

export type StructureDefinition = {
  type: StructureType
  cost: CostStoreState
  levels: StructureLevelDefinition[]
}

export type StructureLevelDefinition = {
  displayName: string // At this moment we can potentially support different names depending on the level
  // of the structure. But this is not implemented because I feel it can cause confusion
  cost: CostStoreState //
  workerCapacity: number // number of workers that can work at this structure at this level
}

export type ResourceStructureDefinition = {
  levels: ResourceStructureLevelDefinition[]
} & StructureDefinition

type HarvestDefinition = {
  amount: number
  lootTable: { [key in ItemType]?: number }
}

export type ResourceStructureLevelDefinition = {
  generates: ResourceStoreState
  harvest?: HarvestDefinition
} & StructureLevelDefinition

export type ProductionStructureDefinition = {
  levels: ProductionStructureLevelDefinition[]
} & StructureDefinition

export type ProductionStructureLevelDefinition = {
  unlocks: ProducableItem[]
} & StructureLevelDefinition

export type WarehouseStructureDefinition = {
  levels: WarehouseStructureLevelDefinition[]
} & StructureDefinition

export type WarehouseStructureLevelDefinition = {
  maxResources: ResourceStoreState
  maxStockpile: number
} & StructureLevelDefinition

export type TavernStructureDefinition = {
  levels: TavernStructureLevelDefinition[]
} & StructureDefinition

export type TavernStructureLevelDefinition = {
  waitingAdventurers: number
  rooms: number
} & StructureLevelDefinition
