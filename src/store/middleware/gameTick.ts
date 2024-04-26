import { type Store } from 'redux'
import { type Action } from 'store/actions'
import { type StoreState } from 'store/types'
import getProducedResources from 'mechanics/gameTick/producedResources'
import getQuestUpdates, { type LogUpdate, type QuestUpdate } from 'mechanics/gameTick/quests'
import getRngState from 'mechanics/gameTick/rngState'
import getHarvest, { type HarvestUpdate } from 'mechanics/gameTick/harvest'
import { type AppMiddlewareAPI } from './utils'
import { type ResourceStoreState } from 'store/types/resources'
import { type GameAction } from 'store/actions/game'
import getTavernUpdates, { type TavernGameTickUpdate } from 'mechanics/gameTick/tavern'
import { type ReplaceInDiscriminatedUnion } from 'utils/typescript'

type ExtendedProps = {
  rngState: any
  resources: ResourceStoreState | null
  quests: QuestUpdate[]
  tavern: TavernGameTickUpdate
  harvest: HarvestUpdate | null
  log: LogUpdate[]
}

export type GameTickActionExt = Extract<GameAction, { type: 'gameTick' }> & ExtendedProps

export type GameActionExt = ReplaceInDiscriminatedUnion<GameAction, GameTickActionExt>

export const gameTickMiddleware = (storeApi: AppMiddlewareAPI) => (next: (action: GameTickActionExt | Action) => GameAction) => (action: GameAction) => {
  if (action.type === 'gameTick') {
    const state = storeApi.getState()
    const delta = action.delta
    const log: LogUpdate[] = []
    const tavern = getTavernUpdates(state)
    const resources = getProducedResources(state.engine.lastProducedUpdate, state)
    const harvest = getHarvest(state)
    const rngState = getRngState()
    const { quests, logUpdates: questUpdates } = getQuestUpdates(delta, storeApi as Store<StoreState>)
    log.push(...questUpdates)

    next({
      ...action,
      resources,
      harvest,
      rngState,
      tavern,
      quests,
      log
    })
  } else {
    next(action)
  }
}
