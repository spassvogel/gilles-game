import { createSelector } from 'reselect'
import { adventurersOnQuest } from 'store/helpers/storeHelpers'
import { type StoreState } from 'store/types'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { QuestStatus, type QuestStoreState } from 'store/types/quest'

// maybe this is not used anymore?

// Store accessors
const getAdventurers = (state: StoreState): AdventurerStoreState[] => state.adventurers
const getQuests = (state: StoreState): QuestStoreState[] => state.quests

export const groupAdventurersByQuest = (adventurers: AdventurerStoreState[], quests: QuestStoreState[]): Record<string, AdventurerStoreState[]> => {
  const foundInParty: AdventurerStoreState[] = [] // store the adventurers in parties in a temp array

  const groupedAdventurers = Object.values(quests).reduce<Record<string, AdventurerStoreState[]>>((acc, value) => {
    const foundAdventurers = adventurersOnQuest(adventurers, value)
    if (value.status === QuestStatus.active) {
      // Only active quests
      acc[value.name] = foundAdventurers
    }
    foundInParty.push(...foundAdventurers)
    return acc
  }, {})

  // Add a special group called 'solo' for those adventurers not in a party
  const soloKey = 'solo'
  groupedAdventurers[soloKey] = adventurers.filter((a) => !foundInParty.includes(a))

  return groupedAdventurers
}

const getAdventurersInTown = (adventurers: AdventurerStoreState[], quests: QuestStoreState[]): AdventurerStoreState[] => {
  // Get an array of all adventurer ids on any active quest
  const adventurersNotInTown = quests.reduce<string[]>((acc, val: QuestStoreState) => {
    if (val.status === QuestStatus.active) {
      acc.push(...val.party)
    }
    return acc
  }, [])

  return adventurers.filter((a) => !adventurersNotInTown.includes(a.id))
}

/** Returns an object keyed by active quests whose value is a list of AdventurerStoreState */
export const selectAdventurersGroupedByQuest = createSelector([
  getAdventurers,
  getQuests],
groupAdventurersByQuest
)

/** Returns a selector keyed by active quests whose value is a list of AdventurerStoreState */
export const createSelectAdventurersOnQuest = (questName: string) => {
  const getAdventurersOnQuest = (adventurers: AdventurerStoreState[], quests: QuestStoreState[]): AdventurerStoreState[] => {
    const quest = quests.find(q => q.name === questName)
    if (quest == null) throw new Error(`No quest named ${questName}`)
    return adventurersOnQuest(adventurers, quest)
  }

  return createSelector([
    getAdventurers,
    getQuests],
  getAdventurersOnQuest
  )
}

/** Returns an object keyed by active quests whose value is a list of AdventurerStoreState */
export const selectAdventurersInTown = createSelector([
  getAdventurers,
  getQuests],
getAdventurersInTown
)
