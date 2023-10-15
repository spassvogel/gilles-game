import { type StoreState } from 'store/types'
import { useSelector } from 'react-redux'
import { selectFreeWorkers } from 'store/selectors/workers'

// Returns all the workers from redux store
export const useWorkersState = () => {
  return useSelector<StoreState, number>(store => store.workers)
}

// Returns all the workers not working on something from redux store
export const useWorkersFreeState = () => {
  return useSelector<StoreState, number>(selectFreeWorkers)
}
