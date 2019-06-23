import { StoreState } from "src/stores";
import { AdventurerStoreState } from "src/stores/adventurer";
import { QuestStoreState } from "src/stores/quest";

// export const adventurersInParty = (store: StoreState, partyId: string): AdventurerStoreState[] => {
//     const party: PartyStoreState = store.parties[partyId];
//     return party.adventurers.map((id: string) => findAdventurerById(store, id)!);
// };

export const adventurersOnQuest = (store: StoreState, quest: QuestStoreState): AdventurerStoreState[] => {
    return quest.party.map((id: string) => findAdventurerById(store, id)!);
};

export const findAdventurerById = (store: StoreState, id: string): AdventurerStoreState | undefined => {
    return store.adventurers.find((a) => a.id === id);
};

export const storeIsRehydrated = (store: StoreState): boolean => {
    // Returns a value indicating whether this store is fresh or rehydrated
    // Probably I should find a more solid way to do this
    return !!store.rngState;
};
