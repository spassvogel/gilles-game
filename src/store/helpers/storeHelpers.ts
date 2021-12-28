import { EquipmentSlotType } from "components/ui/adventurer/EquipmentSlot";
import { Item } from "definitions/items/types";
import { isWeapon, Weapon } from "definitions/items/weapons";
import { StoreState } from "store/types";
import { AdventurerStoreState } from "store/types/adventurer";
import { QuestStoreState } from "store/types/quest";

// export const adventurersInParty = (store: StoreState, partyId: string): AdventurerStoreState[] => {
//   const party: PartyStoreState = store.parties[partyId];
//   return party.adventurers.map((id: string) => findAdventurerById(store, id)!);
// };

/**
 * Returns the quest the given adventurer is currently on. Can be undefined if not on a quest
 */
export const findQuestByAdventurer = (adventurer: AdventurerStoreState, quests: QuestStoreState[]) => {
  return quests.find(q => q.party.some(a => a === adventurer.id))
}

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
 * Returns the amount of free inventory slots on this adventurer */
export const adventurerFreeInventorySlots = (adventurer: AdventurerStoreState): number => {
  return adventurer.inventory.filter(i => i === null).length;
};

/**
 * Returns the weapons the adventurer has. Can be 0, 1 or 2 */
export const adventurerWeapons = (adventurer: AdventurerStoreState): [Item<Weapon>?, Item<Weapon>?] => {
  // const isWeapon =
  const check = (slot: EquipmentSlotType) => {
    const item = adventurer.equipment[slot];
    return !!item && isWeapon(item.type);
  }
  return [
    ...check(EquipmentSlotType.mainHand) ? [adventurer.equipment[EquipmentSlotType.mainHand]] : [],
    ...check(EquipmentSlotType.offHand) ? [adventurer.equipment[EquipmentSlotType.offHand]] : []
  ] as [Item<Weapon>?, Item<Weapon>?];
};

// Returns a value indicating whether this store is fresh or rehydrated
export const storeIsRehydrated = (store: StoreState): boolean => {
  return store?.engine.gameStarted !== undefined;
};

