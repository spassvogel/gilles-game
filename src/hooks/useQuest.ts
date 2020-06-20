import { useCallback } from 'react';
import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { QuestStoreState } from 'stores/quest';

// Returns the quest from redux store
const useQuest = (questName: string) => {
    const questSelector = useCallback(
        (state: StoreState) => state.quests.find((q) => q.name === questName)!, 
        [questName]
    );
    const quest = useSelector<StoreState, QuestStoreState>(questSelector);
    return quest;
}

export default useQuest;