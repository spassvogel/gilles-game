import { useCallback, useMemo } from 'react';
import { StoreState } from 'store/types';
import { useSelector } from 'react-redux';
import { QuestStatus, QuestStoreState } from 'store/types/quest';
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect';
import stringArrayEqual from 'string-arrays-equal';
import { createStringArraySelector } from 'utils/reselect';

const getQuests = (state: StoreState) => state.quests;
const getQuestNames = (state: StoreState) => state.quests.map(q => q.name);
const getQuestStatus = (state: StoreState) => state.quests.map(q => q.status);

const getQuestNameAndStatus = (state: StoreState) => state.quests.map(q => ({ name: q.name, status: q.status }));

const getActiveQuests = (quests: QuestStoreState[]) => {
    // returns the names of the active quests
    return quests.filter((q) => q.status === QuestStatus.active);
};
const getActiveQuestNames = (questNamesAndStatus: { name: string, status: QuestStatus }[]) => {
    // returns the names of the active quests
    return  questNamesAndStatus.filter((q) => q.status === QuestStatus.active).map(q => q.name);
};

// Returns the quest from redux store
export const useQuest = (questName: string) => {
    const questSelector = useCallback(
        (state: StoreState) => state.quests.find((q) => q.name === questName)!,
        [questName]
    );
    const quest = useSelector<StoreState, QuestStoreState>(questSelector);
    return quest;
}

// Returns the active quests from the store
export const useActiveQuests = () => {
    const selectMemoized = useMemo(() => {
        const activeQuests = createSelector(
            [getQuests],
            getActiveQuests,
        );

        return activeQuests;
    }, []);

    return useSelector<StoreState, QuestStoreState[]>(selectMemoized);
}


// Returns the active quests from the store
export const useActiveQuestNames = () => {
    const questNameSelector = useMemo(() => createStringArraySelector(
        [getQuestNames, getQuestStatus],
        (names: string[], statuses: QuestStatus[]) => names.filter((_: string, index: number) => statuses[index] === QuestStatus.active)
    ), []);
    return useSelector<StoreState, string[]>(questNameSelector);
}



//   // use the new "selector creator" to create a selector
//   const mySelector = createDeepEqualSelector(
//     state => state.values.filter(val => val < 5),
//     values => values.reduce((acc, val) => acc + val, 0)
//   )
