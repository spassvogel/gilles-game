import { createSelector } from "reselect";
import { StoreState } from "src/stores";
import { AdventurerStoreState } from "src/stores/adventurer";
import { QuestStoreState } from "src/stores/quest";

const getAdventurers = (state: StoreState): AdventurerStoreState[] => state.adventurers;
const getQuests = (state: StoreState): QuestStoreState[] => state.quests;

const groupAdventurersByQuest = (adventurers: AdventurerStoreState[], quests: QuestStoreState[]): Record<string, AdventurerStoreState[]> => {
    const foundInParty: AdventurerStoreState[] = []; // store the adventurers in parties in a temp array

    const adventurersOnQuest = (questId: string): AdventurerStoreState[] => {
        const party: string[] = quests[questId].party;
        return party.map((id: string) => findAdventurerById(id)!);
    };

    const findAdventurerById = (id: string): AdventurerStoreState | undefined => {
        return adventurers.find((a) => a.id === id);
    };

    // Add up all the workers used by all structures in town
    const groupedAdventurers = Object.keys(quests).reduce((acc, val: string) => {
        acc[val] = adventurersOnQuest(val);
        foundInParty.push(...acc[val]);
        return acc;
    }, {});

    // Add a special group called 'solo' for those adventurers not in a party
    const soloKey = "solo";
    groupedAdventurers[soloKey] = adventurers.filter((a) => foundInParty.indexOf(a) === -1);

    return groupedAdventurers;
};

export const selectAdventurersGroupedByParty = createSelector([
    getAdventurers,
    getQuests],
    groupAdventurersByQuest,
);
