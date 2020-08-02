import { createSelector } from "reselect";
import { StoreState } from "stores";
import { TasksStoreState } from 'stores/tasks';
import { Structure } from 'definitions/structures';

const getTasks = (state: StoreState) => state.tasks;


/** Returns a selector for the store that selects all crafting tasks running for given structure */
export const createSelectCraftingTasksByStructure = (structure: Structure) => {
    const craftingTasksByStructure = (tasks: TasksStoreState) => {
        return tasks.running.filter((val) => val.origin === `${structure}.craft`);
    };
    return createSelector([
        getTasks],
        craftingTasksByStructure,
    );
}
