import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { selectFreeWorkers } from 'selectors/workers';

// Returns all the workers from redux store
export const useWorkers = () => {
    return useSelector<StoreState, number>(store => store.workers);
}

// Returns all the workers not working on something from redux store
export const useWorkersFree = () => {
    const quest = useSelector<StoreState, number>(selectFreeWorkers);
    return quest;
}

