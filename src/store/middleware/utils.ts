import { MiddlewareAPI, Dispatch } from 'redux';
import { Action } from 'store/actions';
import { findQuestByAdventurer } from 'store/helpers/storeHelpers';
import { StoreState } from 'store/types';
import { AdventurerStoreState } from 'store/types/adventurer';

export type AppMiddlewareAPI = MiddlewareAPI<Dispatch<Action>, StoreState>;

/**
 * If the adventurer just completed a scene action returns the corresponding SceneActionType
 */
export const lastAdventurerAction = (adventurer: AdventurerStoreState, action: Action, storeApi: AppMiddlewareAPI) => {
  if (action.type === 'completeSceneAction') {
    const state = storeApi.getState();
    const quest = findQuestByAdventurer(adventurer, state.quests);
    const sceneAction = quest?.scene?.actionQueue?.[0];
    if (sceneAction?.actorId === adventurer.id) {
      return quest?.scene?.actionQueue?.[0].actionType;
    }
  }
};

