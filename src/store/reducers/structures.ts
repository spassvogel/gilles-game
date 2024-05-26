import { type Reducer } from 'redux'
import { isProductionStructure, isResourceStructure, type Structure } from 'definitions/structures'
import {
  StructureState,
  type ProductionStructureStoreState,
  type StructureStoreState,
  type ResourceStructureState,
  type TavernStructureState,
  type TavernLodging
} from 'store/types/structure'
import { type StructuresStoreState } from 'store/types/structures'
import { type StructuresAction } from 'store/actions/structures'
import { type Item } from 'definitions/items/types'
import { type GameTickActionExt } from 'store/middleware/gameTick'
import { ADVENTURER_PREFIX } from 'mechanics/adventurers/generator'
import { getFreeRoom } from 'store/helpers/storeHelpers'
import { ONE_DAY } from 'utils/format/time'

const updateStructureState = (state: StructuresStoreState, structure: Structure, structureState: StructureState) => {
  const structureStore: StructureStoreState = {
    ...state[structure],
    state: structureState
  }
  return {
    ...state,
    [structure]: structureStore
  }
}

const structureInitialState: StructureStoreState = {
  level: 0,
  state: StructureState.NotBuilt,
  workers: 0
}

const tavernInitialState: TavernStructureState = {
  level: 0,
  workers: 0,
  lodging: [{
    adventurer: `${ADVENTURER_PREFIX}c4a5d270`,
    paidUntil: Date.now()
  }, {
    adventurer: `${ADVENTURER_PREFIX}2e655832`,
    paidUntil: Date.now()
  }, {
    adventurer: `${ADVENTURER_PREFIX}ec6f1050`,
    paidUntil: Date.now()
  }],
  // `${ADVENTURER_PREFIX}d299f98a`,
  // `${ADVENTURER_PREFIX}96c686c3`,
  // null
  // `${ADVENTURER_PREFIX}250d1a9d`,
  // `${ADVENTURER_PREFIX}169384ef`
  // `${ADVENTURER_PREFIX}f22d66cb`,
  waiting: [
    // `${ADVENTURER_PREFIX}f22d66cb`,
    // `${ADVENTURER_PREFIX}250d1a9d`,
    // `${ADVENTURER_PREFIX}36c686c1`
  ],
  nextAdventurersArrive: Date.now(),
  state: StructureState.NotBuilt
}

export const initialStructuresState: StructuresStoreState = {
  alchemist: { ...structureInitialState, produces: [] },
  armoursmith: { ...structureInitialState, produces: ['apparel/boots1'] },
  garden: structureInitialState,
  lumberMill: structureInitialState,
  mine: { level: 0, workers: 0, state: StructureState.NotBuilt },
  quarry: structureInitialState,
  tavern: tavernInitialState,
  tannery: structureInitialState,
  warehouse: { level: 0, workers: 0, state: StructureState.Built },
  weaponsmith: { ...structureInitialState, produces: ['weapon/simpleCrossbow', 'weapon/dagger'] },
  weaver: structureInitialState,
  workshop: { ...structureInitialState, produces: ['questItem/torch', 'questItem/sandwich'] }
}

/**
 * Structures reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const structures: Reducer<StructuresStoreState, StructuresAction | GameTickActionExt> = (state = initialStructuresState, action) => {
  switch (action.type) {
    case 'startBuildingStructure': {
      return updateStructureState(state, action.structure, StructureState.Building)
    }

    case 'finishBuildingStructure': {
      if (action.structure === 'tavern') {
        // When we've just constructed the tavern, all lodged adventurers get a free day
        return {
          ...state,
          tavern: {
            ...state.tavern,
            state: StructureState.Built,
            lodging: state.tavern.lodging.map((room) => {
              if (room == null) {
                return null
              }
              return {
                ...room,
                paidUntil: Date.now() + ONE_DAY
              }
            })
          }
        }
      }
      return updateStructureState(state, action.structure, StructureState.Built)
    }

    case 'upgradeStructure': {
      // Upgrade to next level
      const level = state[action.structure].level + 1
      const structureStore: StructureStoreState = {
        ...state[action.structure],
        level
      }
      return {
        ...state,
        [action.structure]: structureStore
      }
    }

    case 'increaseWorkers': {
      const { workers: workersToAdd } = action
      const workers = state[action.structure].workers + workersToAdd
      const structureStore: StructureStoreState = {
        ...state[action.structure],
        workers
      }
      return {
        ...state,
        [action.structure]: structureStore
      }
    }

    case 'decreaseWorkers': {
      const { workers: workersToRemove } = action
      const workers = state[action.structure].workers - workersToRemove
      const structureStore: StructureStoreState = {
        ...state[action.structure],
        workers
      }
      return {
        ...state,
        [action.structure]: structureStore
      }
    }

    case 'setStructureState': {
      const { state: structureState } = action
      return updateStructureState(state, action.structure, structureState)
    }

    case 'addItemToToProduces': {
      // Adds given item to a structures' `produces` list
      if (!isProductionStructure(action.structure)) {
        return state
      }
      const { item } = action
      const produces = [
        ...(state[action.structure]).produces,
        item
      ]
      const structureStore: ProductionStructureStoreState = {
        ...state[action.structure],
        produces
      }
      return {
        ...state,
        [action.structure]: structureStore
      }
    }

    case 'removeItemFromHarvest': {
      // Should always be false but typescript doesnt know that
      if (!isResourceStructure(action.structure)) return state
      const harvest = state[action.structure].harvest?.filter((_h, i) => (i !== action.index))
      return {
        ...state,
        [action.structure]: {
          ...state[action.structure],
          harvest
        }
      }
    }

    case 'lodgeWaitingAdventurer': {
      const adventurerId = state.tavern.waiting[action.slot]
      if (adventurerId == null) {
        // Not sure what happened here
        return state
      }
      const { tavern } = state
      const room = getFreeRoom(tavern)
      if (room === -1) {
        // This shouldnt be happening either
        return state
      }

      const lodging: Array<TavernLodging | null> = tavern.lodging.map((a, i) => {
        if (i === room) {
          return {
            adventurer: adventurerId,
            paidUntil: Date.now() + ONE_DAY
          }
        }
        return a
      })
      if (room >= lodging.length) {
        lodging.push({
          adventurer: adventurerId,
          paidUntil: Date.now() + ONE_DAY
        })
      }

      return {
        ...state,
        tavern: {
          ...tavern,
          waiting: tavern.waiting.map((a, i) => {
            if (i === action.slot) {
              return null
            }
            return a
          }),
          lodging
        }
      }
    }

    case 'dismissWaitingAdventurer': {
      return {
        ...state,
        tavern: {
          ...state.tavern,
          waiting: state.tavern.waiting.map((a, i) => {
            if (i === action.slot) {
              return null
            }
            return a
          })
        }
      }
    }

    case 'gameTick': {
      return tavernReducer(harvestReducer(state, action), action)
    }
  }
  return state
}

const harvestReducer: Reducer<StructuresStoreState, GameTickActionExt> = (state = initialStructuresState, action) => {
  if ((action.harvest == null) || ((Object.keys(action.harvest)?.length) === 0)) {
    return state
  }
  const createHarvestItems = (structure: Structure): ResourceStructureState => {
    const harvest: Item[] = (action.harvest?.[structure] ?? []).map(type => ({ type }))
    return {
      ...state[structure],
      harvest
    }
  }

  // Copies items from harvest into structure
  return {
    ...state,
    garden: createHarvestItems('garden'),
    lumberMill: createHarvestItems('lumberMill'),
    mine: createHarvestItems('mine'),
    quarry: createHarvestItems('quarry'),
    tannery: createHarvestItems('tannery')
  }
}

const tavernReducer: Reducer<StructuresStoreState, GameTickActionExt> = (state = initialStructuresState, action) => {
  if (action.tavern.nextAdventurersArrive == null) {
    return state
  }

  let waiting = state.tavern.waiting
  const adventurers = [...action.tavern.adventurers ?? []]

  if (adventurers.length > 0) {
    waiting = state.tavern.waiting.map((a) => {
      if (a === null) {
        const adventurer = adventurers.shift()
        if (adventurer == null) {
          return a
        }
        return adventurer.id
      }
      return a
    })

    if (adventurers.length > 0) {
      waiting.push(...adventurers.map((a) => a.id))
    }
  }
  return {
    ...state,
    tavern: {
      ...state.tavern,
      waiting,
      nextAdventurersArrive: action.tavern.nextAdventurersArrive
    }
  }
}
