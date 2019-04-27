import { StoreState } from "src/stores";
import { AdventurerStoreState } from "src/stores/adventurer";
import { PartyStoreState } from "src/stores/party";
import { QuestStoreState } from "src/stores/quest";

export const adventurersInParty = (store: StoreState, partyId: string): AdventurerStoreState[] => {
    const party: PartyStoreState = store.parties[partyId];
    return party.adventurers.map((id: string) => findAdventurerById(store, id)!);
};

export const adventurersOnQuest = (store: StoreState, quest: QuestStoreState): AdventurerStoreState[] => {
    const party: PartyStoreState = store.parties[quest.party];
    return party.adventurers.map((id: string) => findAdventurerById(store, id)!);
};

export const findAdventurerById = (store: StoreState, id: string): AdventurerStoreState | undefined => {
    return store.adventurers.find((a) => a.id === id);
};
