import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { selectFreeWorkers } from 'selectors/workers';

// Returns all the workers from redux store
export const useWorkersState = () => {
    return useSelector<StoreState, number>(store => store.workers);
}

// Returns all the workers not working on something from redux store
export const useWorkersFreeState = () => {
    return useSelector<StoreState, number>(selectFreeWorkers);
}

