import { AdventurerStoreState } from 'stores/adventurer';
import { QuestStoreState, QuestStatus } from 'stores/quest';
import { StoreState } from 'stores';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const getAdventurersInTown = (adventurers: AdventurerStoreState[], quests: QuestStoreState[]): AdventurerStoreState[] => {
    // Get an array of all adventurer ids on any active quest
    const adventurersOnQuest = quests.reduce<string[]>((acc, val: QuestStoreState) => {
        if (val.status === QuestStatus.active) {
            acc.push(...val.party);
        }
        return acc;
    }, []);

    return adventurers.filter((a) => adventurersOnQuest.indexOf(a.id) === -1);
};

/** Returns all the adventurers currently not on a mission */
export const useAdventurersInTown = () => {
    const adventurers = useSelector<StoreState, AdventurerStoreState[]>(store => store.adventurers);
    const quests = useSelector<StoreState, QuestStoreState[]>(store => store.quests);

    const adventurersInTown = useMemo(() => {
        return getAdventurersInTown(adventurers, quests)
    }, [adventurers, quests]);

    return adventurersInTown;
}