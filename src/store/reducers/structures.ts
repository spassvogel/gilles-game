import { type Reducer } from 'redux'
import { isProductionStructure, isResourceStructure, type Structure } from 'definitions/structures'
import {
  type ProductionStructureStoreState,
  StructureState,
  type StructureStoreState,
  type ResourceStructureState
} from 'store/types/structure'
import { type StructuresStoreState } from 'store/types/structures'
import { type StructuresAction } from 'store/actions/structures'
import { type Item } from 'definitions/items/types'
import { type GameTickActionExt } from 'store/middleware/gameTick'
import { ADVENTURER_PREFIX } from 'mechanics/adventurers/generator'

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

const tavernInitialState = {
  level: 0,
  workers: 0,
  lodging: [
    `${ADVENTURER_PREFIX}c4a5d270`,
    `${ADVENTURER_PREFIX}2e655832`,
    `${ADVENTURER_PREFIX}ec6f1050`,
    `${ADVENTURER_PREFIX}d299f98a`,
    `${ADVENTURER_PREFIX}96c686c3`,
    null,
    `${ADVENTURER_PREFIX}250d1a9d`,
    `${ADVENTURER_PREFIX}169384ef`,
    `${ADVENTURER_PREFIX}f22d66cb`,
    `${ADVENTURER_PREFIX}36c686c1`
  ],
  waiting: [],
  nextAdventurersArrive: 0,
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

    case 'gameTick': {
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
  }
  return state
}
