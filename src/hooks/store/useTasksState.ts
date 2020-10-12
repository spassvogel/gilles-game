import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { TasksStoreState } from 'stores/tasks';
import { createSelectCraftingTasksByStructure, createSelectStudyingTasksByStructure, createSelectUpgradeTasksByStructure } from 'selectors/tasks';
import { Structure } from 'definitions/structures';

// Returns all the tasks from redux store
export const useTasksState = () => {
    return useSelector<StoreState, TasksStoreState>(store => store.tasks);
}

// Returns all running crafting tasks for given structure
export const useCraftingTasksStateByStructure = (structure: Structure) => {
    return useSelector(createSelectCraftingTasksByStructure(structure));
}

// Returns all running crafting tasks for given structure
export const useStudyingTasksStateByStructure = (structure: Structure) => {
    return useSelector(createSelectStudyingTasksByStructure(structure));
}

// Returns all running update tasks for given structure
export const useUpgradeTasksStateByStructure = (structure: Structure) => {
    return useSelector(createSelectUpgradeTasksByStructure(structure));
}

