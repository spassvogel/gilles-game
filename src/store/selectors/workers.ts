import { type Structure } from 'definitions/structures'
import { createSelector } from 'reselect'
import { type StoreState } from 'store/types'
import { type StructureStoreState } from 'store/types/structure'
import { type StructuresStoreState } from 'store/types/structures'

const getStructures = (state: StoreState) => state.structures
const getWorkers = (state: StoreState) => state.workers

const calculateFreeWorkers = (structures: StructuresStoreState, workers: number) => {
  // Add up all the workers used by all structures in town
  const workersUsed = Object.keys(structures).map((name) => structures[name as Structure])
    .reduce((acc: number, value: StructureStoreState) => {
      acc += value.workers
      return acc
    }, 0)

  return workers - workersUsed
}

export const selectFreeWorkers = createSelector([
  getStructures,
  getWorkers],
calculateFreeWorkers
)
