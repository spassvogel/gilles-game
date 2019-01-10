import { StoreState } from "src/stores";
import { AdventurerStoreState } from "src/stores/adventurer";
import { QuestStoreState } from "src/stores/quest";

export const adventurersOnQuest = (store: StoreState, quest: QuestStoreState): AdventurerStoreState[] => {
    return quest.party.map((id) => findAdventurerById(store, id)!);
};

export const findAdventurerById = (store: StoreState, id: string): AdventurerStoreState | undefined => {
    return store.adventurers.find((a) => a.id === id);
};
