import { AdventurerStoreState } from 'store/types/adventurer';
import { QuestStoreState, QuestStatus } from 'store/types/quest';
import { StoreState } from 'store/types';
import { useSelector } from 'react-redux';
import { useMemo, useCallback } from 'react';
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot';
import { Apparel, getDefinition } from 'definitions/items/apparel';
import { Item } from 'definitions/items/types';

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
    return getAdventurersInTown(adventurers, quests);
  }, [adventurers, quests]);

  return adventurersInTown;
};

export const useAdventurers = () => {
  return useSelector<StoreState, AdventurerStoreState[]>(store => store.adventurers);
};

/** Returns the adventurer from store */
export const useAdventurer = (adventurerId: string) => {
  const adventurerSelector = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state: StoreState) => state.adventurers.find((q) => q.id === adventurerId)!,
    [adventurerId],
  );
  return useSelector<StoreState, AdventurerStoreState>(adventurerSelector);
};

/* Returns a map keyed by EquipmentSlotType with DR of an adventurer.
   0 if nothing worn or if item does not have DR */
export const useAdventurerDamageReduction = (adventurerId: string): { [key: string]: number } => {
  const adventurer = useAdventurer(adventurerId);
  const findDR = (type: EquipmentSlotType) => {
    const item: Item<Apparel> | undefined = adventurer.equipment[type as EquipmentSlotType] as Item<Apparel>;
    if (!item) return 0;
    return getDefinition(item.type).damageReduction || 0;
  };
  return {
    [EquipmentSlotType[EquipmentSlotType.head]]: findDR(EquipmentSlotType.head),
    [EquipmentSlotType[EquipmentSlotType.chest]]: findDR(EquipmentSlotType.chest),
    [EquipmentSlotType[EquipmentSlotType.hands]]: findDR(EquipmentSlotType.hands),
    [EquipmentSlotType[EquipmentSlotType.shoulders]]: findDR(EquipmentSlotType.shoulders),
    [EquipmentSlotType[EquipmentSlotType.legs]]: findDR(EquipmentSlotType.legs),
    [EquipmentSlotType[EquipmentSlotType.feet]]: findDR(EquipmentSlotType.feet),
  };
};

export const useAdventurerMainhandItem = (adventurerId: string) => {
  const adventurer = useAdventurer(adventurerId);
  return adventurer.equipment[EquipmentSlotType.mainHand];
};
