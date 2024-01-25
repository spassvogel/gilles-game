import { type MiddlewareAPI, type Dispatch } from 'redux'
import { type Action } from 'store/actions'
import { findQuestByAdventurer } from 'store/helpers/storeHelpers'
import { type StoreState } from 'store/types'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { getUniqueName } from 'store/types/scene'

export type AppMiddlewareAPI = MiddlewareAPI<Dispatch<Action>, StoreState>

/**
 * If the adventurer just completed a scene action returns the corresponding SceneActionType
 */
export const lastAdventurerAction = (adventurer: AdventurerStoreState, action: Action, storeApi: AppMiddlewareAPI) => {
  if (action.type === 'completeSceneAction') {
    const state = storeApi.getState()
    const quest = findQuestByAdventurer(adventurer, state.quests)
    const sceneAction = quest?.scene?.actionQueue?.[0]
    if (((sceneAction?.intent.actor) != null) && getUniqueName(sceneAction.intent.actor) === adventurer.id) {
      return quest?.scene?.actionQueue?.[0].intent.action
    }
  }
}
