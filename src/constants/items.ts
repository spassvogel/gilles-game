import { type DragSourceType } from './dragging'

export enum Rarity {
  // gray = common, green = uncommon, blue = rare, purple = epic, orange = legendary
  common,
  uncommon,
  rare,
  epic,
  legendary,
}

// Information about where an item is found
export type ItemSource = {
  origin: DragSourceType
  id?: string // eg: adventurerId
  slot?: number // slot in the inventory
}
