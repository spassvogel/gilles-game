import { Structure } from "definitions/structures";
import { ProducableItem, StructureState } from "store/types/structure";

export type StructuresAction =
  { type: "upgradeStructure", structure: Structure }
 |  { type: "increaseWorkers", structure: Structure, workers: number}
 |  { type: "decreaseWorkers", structure: Structure, workers: number}
 |  { type: "startBuildingStructure", structure: Structure }
 |  { type: "finishBuildingStructure", structure: Structure }
 |  { type: "setStructureState", structure: Structure, state: StructureState }
 |  { type: "addItemToToProduces", structure: Structure, item: ProducableItem }
 |  { type: "removeItemFromHarvest", structure: Structure, index: number }


export const startBuildingStructure = (structure: Structure): StructuresAction => ({
  type: "startBuildingStructure",
  structure,
})

export const finishBuildingStructure = (structure: Structure): StructuresAction => ({
  type: "finishBuildingStructure",
  structure,
})

export const upgradeStructure = (structure: Structure): StructuresAction => ({
  type: "upgradeStructure",
  structure,
})

// Increases workers used by given structure by given amount
export const increaseWorkers = (structure: Structure, workers = 1): StructuresAction => ({
  type: "increaseWorkers",
  structure,
  workers
})

// Decreases workers used by given structure by given amount
export const decreaseWorkers = (structure: Structure, workers = 1): StructuresAction => ({
  type: "decreaseWorkers",
  structure,
  workers
})

// Set state directly
export const setStructureState = (structure: Structure, state: StructureState): StructuresAction => ({
  type: "setStructureState",
  structure,
  state
})

// Structure can now preoduce this
export const addItemToToProduces = (structure: Structure, item: ProducableItem): StructuresAction => ({
  type: "addItemToToProduces",
  structure,
  item
})

// Take item at specified index
export const removeItemFromHarvest = (structure: Structure, index: number): StructuresAction => ({
  type: "removeItemFromHarvest",
  structure,
  index
})
