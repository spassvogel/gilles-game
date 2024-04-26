import { getDefinition } from 'definitions/structures'
import {
  type TavernStructureDefinition
} from 'definitions/structures/types'
import { type StoreState } from 'store/types'
import { type StructuresStoreState } from 'store/types/structures'
import { StructureState } from 'store/types/structure'
import { generateRandomAdventurer } from 'mechanics/adventurers/generator'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { ONE_HOUR } from 'utils/format/time'

export type TavernGameTickUpdate = {
  nextAdventurersArrive?: number
  adventurers?: AdventurerStoreState[]
}

const ADVENTURER_ARRIVAL_INTERVAL = ONE_HOUR * 3
const LEVEL = 1 // level to generate. todo: make dynamic based on player progress

// Game tick logic for the tavern. Periodically it spawns new adventurers, that will end up in the waiting area
const getTavernUpdates = (store: StoreState): TavernGameTickUpdate => {
  const structures: StructuresStoreState = store.structures
  const { level, state, nextAdventurersArrive } = structures.tavern

  const result: TavernGameTickUpdate = {
  }

  if (state !== StructureState.Built) {
    // If the tavern is not built yet, there's not much we can do
    return result
  }

  const structureDefinition = getDefinition<TavernStructureDefinition>('tavern')
  const levelDefinition = structureDefinition.levels[level]
  const slots = levelDefinition.waitingAdventurers

  if (nextAdventurersArrive === 0 || Date.now() > nextAdventurersArrive) {
    // we're on a new cycle
    result.nextAdventurersArrive = Date.now() + ADVENTURER_ARRIVAL_INTERVAL

    // check how much empty spaces we have
    const amount = slots - structures.tavern.waiting.filter((a => a != null)).length
    result.adventurers = []
    for (let i = 0; i < amount; i++) {
      const adventurer = generateRandomAdventurer(LEVEL)
      result.adventurers.push(adventurer)
    }
  }

  return result
}

export default getTavernUpdates
