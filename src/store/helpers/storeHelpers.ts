import { StoreState } from "store/types";
import { AdventurerStoreState } from "store/types/adventurer";
import { QuestStoreState } from "store/types/quest";

// export const adventurersInParty = (store: StoreState, partyId: string): AdventurerStoreState[] => {
//     const party: PartyStoreState = store.parties[partyId];
//     return party.adventurers.map((id: string) => findAdventurerById(store, id)!);
// };

export const adventurersOnQuest = (adventurers: AdventurerStoreState[], quest: QuestStoreState): AdventurerStoreState[] => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    return store?.engine.gameStarted !== undefined;
};

