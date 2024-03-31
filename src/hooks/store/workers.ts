import { type StoreState } from 'store/types'
import { useSelector } from 'react-redux'
import { selectFreeWorkers } from 'store/selectors/workers'
import { type Structure } from 'definitions/structures'
import { useStructureState } from './structures'

// Returns all the workers from redux store
export const useWorkersState = () => {
  return useSelector<StoreState, number>(store => store.workers)
}

// Returns all the workers not working on something from redux store
export const useWorkersFreeState = () => {
  return useSelector<StoreState, number>(selectFreeWorkers)
}

// Returns the worker count working at a perticular structure
export const useWorkersAtStructureState = (structure: Structure) => {
  const structureState = useStructureState(structure)
  return structureState.workers
}
