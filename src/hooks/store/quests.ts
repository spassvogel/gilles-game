import { useCallback, useMemo } from 'react';
import { StoreState } from 'store/types';
import { useSelector } from 'react-redux';
import { QuestStatus, QuestStoreState } from 'store/types/quest';
import { createSelector } from 'reselect';
import { createStringArraySelector } from 'utils/reselect';
import { SceneObject, SceneStoreState } from 'store/types/scene';

const getQuests = (state: StoreState) => state.quests;
const getQuestNames = (state: StoreState) => state.quests.map(q => q.name);
const getQuestStatus = (state: StoreState) => state.quests.map(q => q.status);


const getActiveQuests = (quests: QuestStoreState[]) => {
  // returns the names of the active quests
  return quests.filter((q) => q.status === QuestStatus.active);
};

// Returns the quest from redux store
export const useQuest = (questName: string) => {
  const questSelector = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state: StoreState) => state.quests.find((q) => q.name === questName)!,
    [questName]
  );
  const quest = useSelector<StoreState, QuestStoreState>(questSelector);
  return quest;
}

export const useQuestScene = (questName: string) => {
  const scene = useSelector<StoreState, SceneStoreState | undefined>(
    store => store.quests.find((q) => q.name === questName)?.scene)
  return scene;
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


export const useActorObject = <T extends SceneObject>(questName: string, actorName: string): (T | undefined) =>  {
  const scene = useQuestScene(questName);
  return useMemo(() => {
    return scene?.objects.find(sA => sA.name === actorName) as T;
  }, [actorName, scene?.objects])
}
