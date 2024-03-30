import { useSelector } from 'react-redux'
import { type TasksStoreState } from 'store/types/tasks'
import { createSelectCraftingTasksByStructure, createSelectStudyingTasksByStructure, createSelectUpgradeTasksByStructure } from 'store/selectors/tasks'
import { type Structure } from 'definitions/structures'
import { type StoreState } from 'store/types'
import { useMemo } from 'react'

// Returns all the tasks from redux store
export const useTasksState = () => {
  return useSelector<StoreState, TasksStoreState>(store => store.tasks)
}

export const useStructureBuildingTaskState = (structure: Structure) => {
  const tasks = useTasksState()

  return useMemo(() => {
    const buildTask = tasks.running.filter((t) => t.origin === 'town' && t.name === `${structure}.build`)[0]
    return buildTask
  }, [structure, tasks.running])
}

// Returns all running crafting tasks for given structure
export const useCraftingTasksStateByStructure = (structure: Structure) => {
  return useSelector(createSelectCraftingTasksByStructure(structure))
}

// Returns all running crafting tasks for given structure
export const useStudyingTasksStateByStructure = (structure: Structure) => {
  return useSelector(createSelectStudyingTasksByStructure(structure))
}

// Returns all running update tasks for given structure
export const useUpgradeTasksStateByStructure = (structure: Structure) => {
  return useSelector(createSelectUpgradeTasksByStructure(structure))
}
