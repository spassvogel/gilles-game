import { createSelector } from "reselect";
import { StoreState } from "store/types";
import { TasksStoreState } from 'store/types/tasks';
import { Structure } from 'definitions/structures';

const getTasks = (state: StoreState) => state.tasks;

/*
 * Returns a selector for the store that selects all crafting tasks running for given structure */
export const createSelectCraftingTasksByStructure = (structure: Structure) => {
  const craftingTasksByStructure = (tasks: TasksStoreState) => {
    return tasks.running.filter((val) => val.origin === `${structure}.craft`);
  };
  return createSelector([
    getTasks],
    craftingTasksByStructure,
  );
}

/*
 * Returns a selector for the store that selects all study tasks running for given structure */
export const createSelectStudyingTasksByStructure = (structure: Structure) => {
  const studyingTasksByStructure = (tasks: TasksStoreState) => {
    return tasks.running.filter((val) => val.origin === `${structure}.study`);
  };
  return createSelector([
    getTasks],
    studyingTasksByStructure,
  );
}

/*
 * Returns a selector for the store that selects all upgrade tasks running for given structure
 * Typically 0 or 1 */
export const createSelectUpgradeTasksByStructure = (structure: Structure) => {
  const upgradeTasksByStructure = (tasks: TasksStoreState) => {
    return tasks.running.filter((val) => val.name === `${structure}.upgrade`);
  };
  return createSelector([
    getTasks],
    upgradeTasksByStructure,
  );
}
