import { type StoreState } from 'store/types'
import { useSelector } from 'react-redux'
import { type ResourceStoreState } from 'store/types/resources'
import { selectMaxResources } from 'store/selectors/resources'
import { type Resource } from 'definitions/resources'
import { useMemo } from 'react'

// Returns the resources from the warehouse
export const useResourcesState = () => {
  return useSelector<StoreState, ResourceStoreState>(store => store.resources)
}

// Returns the maximum of each resource that the warehouse can hold
export const useMaxResourcesState = () => {
  return useSelector<StoreState, ResourceStoreState>(selectMaxResources)
}

/** Returns a boolean indicating whether there are enough resources in stock for provided `cost` */
export const useEnoughResources = (cost: ResourceStoreState) => {
  const resources = useResourcesState()

  return useMemo(() => Object.keys(cost).every((costResources) => {
    const resource = costResources as Resource
    return (resources[resource] ?? -1) >= (cost[resource] ?? 0)
  }), [cost, resources])
}
