import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { TasksStoreState } from 'stores/tasks';
import { createSelectCraftingTasksByStructure } from 'selectors/tasks';
import { Structure } from 'definitions/structures';

// Returns all the tasks from redux store
export const useTasksState = () => {
    return useSelector<StoreState, TasksStoreState>(store => store.tasks);
}

// Returns all running tasks for given structure
export const useCraftingTasksStateByStructure = (structure: Structure) => {
    return useSelector(createSelectCraftingTasksByStructure(structure));
}

