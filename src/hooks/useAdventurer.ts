import { useCallback } from 'react';
import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { AdventurerStoreState } from 'stores/adventurer';

// Returns the adventurer from redux store
const useAdventurer = (adventurerId: string) => {
    const adventurerSelector = useCallback(
        (state: StoreState) => state.adventurers.find((q) => q.id === adventurerId)!, 
        [adventurerId]
    );
    const quest = useSelector<StoreState, AdventurerStoreState>(adventurerSelector);
    return quest;
}

export default useAdventurer;