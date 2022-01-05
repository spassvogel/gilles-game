export const MAX_WORKERS_CRAFTING = 6;

/**
 * Calculates the production time for productionDefinition with given amount of workers
 * @param productionDefinition
 * @param workers
 */
export const calculateProductionTime = (time: number, workers: number): number => {
  if (workers > MAX_WORKERS_CRAFTING) {
    throw new Error(`Cannot possibly have more than ${MAX_WORKERS_CRAFTING} on one item!`);
  }
  // Each additional worker shaves off 10% of the production time
  return time - (.1 * time * (workers - 1));
};
