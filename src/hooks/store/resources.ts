import { type StoreState } from 'store/types'
import { useSelector } from 'react-redux'
import { type ResourceStoreState } from 'store/types/resources'
import { selectMaxResources } from 'store/selectors/resources'

// Returns the resources from the warehouse
export const useResourcesState = () => {
  return useSelector<StoreState, ResourceStoreState>(store => store.resources)
}

// Returns the maximum of each resource that the warehouse can hold
export const useMaxResourcesState = () => {
  return useSelector<StoreState, ResourceStoreState>(selectMaxResources)
}
