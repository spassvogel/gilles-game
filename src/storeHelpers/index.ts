import { StoreState } from "stores";
import { AdventurerStoreState } from "stores/adventurer";
import { QuestStoreState } from "stores/quest";

// export const adventurersInParty = (store: StoreState, partyId: string): AdventurerStoreState[] => {
//     const party: PartyStoreState = store.parties[partyId];
//     return party.adventurers.map((id: string) => findAdventurerById(store, id)!);
// };

export const adventurersOnQuest = (adventurers: AdventurerStoreState[], quest: QuestStoreState): AdventurerStoreState[] => {
    return quest.party.map((id: string) => findAdventurerById(adventurers, id)!);
};

export const getQuestLeader = (adventurers: AdventurerStoreState[], quest: QuestStoreState): AdventurerStoreState | undefined => {
    const leaderId = quest.party[0];
    return findAdventurerById(adventurers, leaderId);
}

export const findAdventurerById = (adventurers: AdventurerStoreState[], id: string): AdventurerStoreState | undefined => {
    return adventurers.find((a) => a.id === id);
};

/**
 * Returns the amount of free inventory slots on this adventurer
 */
export const adventurerFreeInventorySlots = (adventurer: AdventurerStoreState): number => {
    return adventurer.inventory.filter(i => i === null).length;
};

export const storeIsRehydrated = (store: StoreState): boolean => {
    // Returns a value indicating whether this store is fresh or rehydrated
    // Probably I should find a more solid way to do this
    return !!store.rngState;
};

