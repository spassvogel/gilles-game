import { type Location, locationEquals } from 'utils/tilemap'
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { type Item } from 'definitions/items/types'
import { isWeapon, type Weapon } from 'definitions/items/weapons'
import { type StoreState } from 'store/types'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { type QuestStoreState } from 'store/types/quest'
import { isAdventurer, isEnemy, type SceneObject } from 'store/types/scene'
import { type Ammunition, isAmmunition } from 'definitions/items/ammunition'
import { type TavernStructureState } from 'store/types/structure'
import { getDefinition } from 'definitions/structures'
import { type TavernStructureDefinition } from 'definitions/structures/types'

// export const adventurersInParty = (store: StoreState, partyId: string): AdventurerStoreState[] => {
//   const party: PartyStoreState = store.parties[partyId]
//   return party.adventurers.map((id: string) => findAdventurerById(store, id)!)
// }

/**
 * Returns the quest the given adventurer is currently on. Can be undefined if not on a quest
 */
export const findQuestByAdventurer = (adventurer: AdventurerStoreState, quests: QuestStoreState[]) => {
  return quests.find(q => q.party.some(a => a === adventurer.id))
}

export const findAdventurerById = (adventurers: AdventurerStoreState[], id: string): AdventurerStoreState | undefined => {
  return adventurers.find((a) => a.id === id)
}

export const adventurersOnQuest = (adventurers: AdventurerStoreState[], quest: QuestStoreState): AdventurerStoreState[] => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return quest.party.map((id: string) => findAdventurerById(adventurers, id)!)
}

export const getQuestLeader = (adventurers: AdventurerStoreState[], quest: QuestStoreState): AdventurerStoreState | undefined => {
  const leaderId = quest.party[0]
  return findAdventurerById(adventurers, leaderId)
}

/**
 * Returns the amount of free inventory slots on this adventurer */
export const adventurerFreeInventorySlots = (adventurer: AdventurerStoreState): number => {
  return adventurer.inventory.filter(i => i === null).length
}

/**
 * Returns the weapons the adventurer has. Can be 0, 1 or 2 */
export const adventurerWeapons = (adventurer: AdventurerStoreState): [Item<Weapon>?, Item<Weapon>?] => {
  const check = (slot: EquipmentSlotType) => {
    const item = adventurer.equipment[slot]
    return !(item == null) && isWeapon(item.type)
  }
  return [
    ...check(EquipmentSlotType.mainHand) ? [adventurer.equipment[EquipmentSlotType.mainHand]] : [],
    ...check(EquipmentSlotType.offHand) ? [adventurer.equipment[EquipmentSlotType.offHand]] : []
  ] as [Item<Weapon>?, Item<Weapon>?]
}

/**
 * Returns the ammo in the offhand slot */
export const adventurerAmmo = (adventurer: AdventurerStoreState): Item<Ammunition> | undefined => {
  const item = adventurer.equipment[EquipmentSlotType.offHand]
  return ((item != null) && isAmmunition(item.type)) ? adventurer.equipment[EquipmentSlotType.offHand] as Item<Ammunition> : undefined
}

/**
 * Returns the index of the first free room in the tavern, or -1 if all rooms are occupied
*/
export const getFreeRoom = (tavern: TavernStructureState) => {
  const structureDefinition = getDefinition<TavernStructureDefinition>('tavern')
  const levelDefinition = structureDefinition.levels[tavern.level]
  const roomCount = levelDefinition.rooms
  for (let i = 0; i < roomCount; i++) {
    if (tavern.lodging[i] == null) {
      return i
    }
  }
  return -1
}

// Searches `objects` list and returns the object at `location` (if any)
export const getSceneObjectsAtLocation = (objects: SceneObject[], location: Location, additionalFilter: (object: SceneObject) => boolean = () => true) => {
  return objects.filter(o => o.location !== undefined && locationEquals(o.location, location) && additionalFilter(o))
}

export const getSceneObjectWithName = (objects: SceneObject[], name: string) => {
  return objects.find(sA => (isAdventurer(sA) && sA.adventurerId === name) || (isEnemy(sA) && sA.enemyId === name))
}

// Returns a value indicating whether this store is fresh or rehydrated
export const storeIsRehydrated = (store: StoreState): boolean => {
  return store?.engine.gameStarted !== undefined
}
