import { createSelector } from "reselect";
import { StoreState } from "stores";
import { StructureStoreState } from "stores/structure";
import { StructuresStoreState } from "stores/structures";

const getStructures = (state: StoreState) => state.structures;
const getWorkers = (state: StoreState) => state.workers;

const calculateFreeWorkers = (structures: StructuresStoreState, workers: number) => {
    // Add up all the workers used by all structures in town
    const workersUsed = Object.keys(structures).map((name) => structures[name])
        .reduce((acc: number, value: StructureStoreState) => acc += value.workers, 0);

    return workers - workersUsed;
};

export const selectFreeWorkers = createSelector([
    getStructures,
    getWorkers],
    calculateFreeWorkers,
);
