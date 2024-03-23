import { combineReducers } from '@reduxjs/toolkit'
import { type StoreState } from 'store/types'
import { adventurers, initialAdventurers } from './adventurers'
import { engine, getInitialEngineState } from './engine'
import { game, initialGameState } from './game'
import { gold, initialGoldState } from './gold'
import { getInitialStockpile, stockpile } from './stockpile'
import { initialLogState, log } from './log'
import { initialQuestState, quests } from './quests'
import { initialResourcesState, resources } from './resources'
import { initialRngState, rngState } from './rngState'
import { initialSettingsState, settings } from './settings'
import { initialStructuresState, structures } from './structures'
import { initialTasksState, tasks } from './tasks'
import { initialWorkersState, workers } from './workers'
import { type Action } from 'store/actions'

export const combinedReducer = combineReducers({
  adventurers,
  engine,
  game,
  gold,
  stockpile,
  log,
  quests,
  resources,
  rngState,
  settings,
  structures,
  tasks,
  workers
})

export const createInitialStore = () => ({
  adventurers: initialAdventurers,
  engine: getInitialEngineState(),
  game: initialGameState,
  gold: initialGoldState,
  stockpile: getInitialStockpile(),
  log: initialLogState,
  quests: initialQuestState,
  resources: initialResourcesState,
  rngState: initialRngState,
  settings: initialSettingsState,
  structures: initialStructuresState,
  tasks: initialTasksState,
  workers: initialWorkersState
})

// eslint-disable-next-line @typescript-eslint/default-param-last
const rootReducer = (state: StoreState = createInitialStore(), action: Action) => {
  switch (action.type) {
    case 'loadGame':
      return action.state
    default:
      return combinedReducer(state, action)
  }
}

export default rootReducer
