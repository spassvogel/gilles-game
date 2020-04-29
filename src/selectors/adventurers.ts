import { createSelector } from "reselect";
import { StoreState } from "stores";
import { AdventurerStoreState } from "stores/adventurer";
import { QuestStatus, QuestStoreState } from "stores/quest";
import { adventurersOnQuest } from 'storeHelpers';

// Store accessors
const getAdventurers = (state: StoreState): AdventurerStoreState[] => state.adventurers;
const getQuests = (state: StoreState): QuestStoreState[] => state.quests;



const groupAdventurersByQuest = (adventurers: AdventurerStoreState[], quests: QuestStoreState[]): Record<string, AdventurerStoreState[]> => {
    const foundInParty: AdventurerStoreState[] = []; // store the adventurers in parties in a temp array


    const groupedAdventurers = Object.values(quests).reduce((acc, val: QuestStoreState) => {
        const foundAdventurers = adventurersOnQuest(adventurers,val);
        if (val.status === QuestStatus.active) {
            // Only active quests
            acc[val.name] = foundAdventurers;
        }
        foundInParty.push(...foundAdventurers);
        return acc;
    }, {});

    // Add a special group called 'solo' for those adventurers not in a party
    const soloKey = "solo";
    groupedAdventurers[soloKey] = adventurers.filter((a) => foundInParty.indexOf(a) === -1);

    return groupedAdventurers;
};

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

/** Returns an object keyed by active quests whose value is a list of AdventurerStoreState */
export const selectAdventurersGroupedByQuest = createSelector([
    getAdventurers,
    getQuests],
    groupAdventurersByQuest,
);

/** Returns a selector keyed by active quests whose value is a list of AdventurerStoreState */
export const createSelectAdventurersOnQuest = (questName: string) => {
    const getAdventurersOnQuest = (adventurers: AdventurerStoreState[], quests: QuestStoreState[]): AdventurerStoreState[] => {
        const quest = quests.find(q => q.name === questName)!;
        return adventurersOnQuest(adventurers, quest);
    };

    return createSelector([
        getAdventurers,
        getQuests],
        getAdventurersOnQuest,
    );
}
/** Returns an object keyed by active quests whose value is a list of AdventurerStoreState */
export const selectAdventurersInTown = createSelector([
    getAdventurers,
    getQuests],
    getAdventurersInTown,
);