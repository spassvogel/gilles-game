import { createSelector } from "reselect";
import { StoreState } from "src/stores";
import { AdventurerStoreState } from "src/stores/adventurer";
import { QuestStoreState } from "src/stores/quest";

const getAdventurers = (state: StoreState): AdventurerStoreState[] => state.adventurers;
const getQuests = (state: StoreState): QuestStoreState[] => state.quests;

const groupAdventurersByQuest = (adventurers: AdventurerStoreState[], quests: QuestStoreState[]): Record<string, AdventurerStoreState[]> => {
    const foundInParty: AdventurerStoreState[] = []; // store the adventurers in parties in a temp array

    const adventurersOnQuest = (quest: QuestStoreState): AdventurerStoreState[] => {
        const party: string[] = quest.party;
        return party.map((id: string) => findAdventurerById(id)!);
    };

    const findAdventurerById = (id: string): AdventurerStoreState | undefined => {
        return adventurers.find((a) => a.id === id);
    };

    const groupedAdventurers = Object.values(quests).reduce((acc, val: QuestStoreState) => {
        const foundAdventurers = adventurersOnQuest(val);
        if (foundAdventurers.length > 0) {
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

/** Returns an object keyed by active quests whose value is a list of AdventurerStoreState */
export const selectAdventurersGroupedByQuest = createSelector([
    getAdventurers,
    getQuests],
    groupAdventurersByQuest,
);
