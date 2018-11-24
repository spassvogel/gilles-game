import { createSelector } from 'reselect';
import { StoreState } from 'src/stores';
import { StructuresStoreState } from 'src/stores/structures';
import { StructureStoreState } from 'src/stores/structure';

const getStructures = (state:StoreState) => state.structures;
const getWorkers = (state:StoreState) => state.workers;

const calculateFreeWorkers = (structures:StructuresStoreState, workers:number) => {
    const workersUsed = Object.keys(structures).map(name => structures[name])
        .reduce((acc:number, value:StructureStoreState) => acc += value.workers || 0, 0)
    console.log("Workers used changed " + workersUsed)

    return workers - workersUsed;
}

export const selectFreeWorkers = createSelector([
    getStructures,
    getWorkers],
    calculateFreeWorkers
)
