import { type Reducer } from 'redux'
import { type EngineStoreState } from 'store/types/engine'
import { HARVEST_INTERVAL } from 'mechanics/gameTick/harvest'
import { type GameAction } from 'store/actions/game'
import { type GameTickActionExt } from 'store/middleware/gameTick'

export const getInitialEngineState = () => {
  return {
    gameStarted: undefined,
    previousTick: Date.now(),
    lastTick: Date.now(),
    lastProducedUpdate: Date.now(),
    lastHarvest: Date.now()
  }
}

type GameActionExtended = Exclude<GameAction, { type: 'gameTick' }> | GameTickActionExt

/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const engine: Reducer<EngineStoreState, GameActionExtended> = (state = getInitialEngineState(), action) => {
  switch (action.type) {
    case 'startGame': {
      return {
        ...state,
        gameStarted: Date.now()
      }
    }
    case 'gameTick': {
      // Keep track of the last time resources were produced
      const resourcesToAdd = action.resources
      const lastProducedUpdate = resourcesToAdd === null ? state.lastProducedUpdate : Date.now()

      // Keep track of last harvest
      const lastHarvest = action.harvest === null || (Object.keys(action.harvest).length === 0) ? state.lastHarvest : Date.now()

      const previousTick = state.lastTick

      return {
        ...state,
        previousTick,
        lastProducedUpdate,
        lastTick: Date.now(),
        lastHarvest
      }
    }

    case 'reduceTime': {
      if (action.percentage < 0 || action.percentage > 100) return state
      switch (action.time) {
        case 'harvest': {
          const timeLeft = HARVEST_INTERVAL - (Date.now() - state.lastHarvest)

          const delta = timeLeft * (action.percentage / 100)
          return {
            ...state,
            lastHarvest: state.lastHarvest - delta
          }
        }
      }
      return state
    }
  }
  return state
}
