import { Middleware, Store } from 'redux';
import { Action } from 'store/actions';
import { StoreState } from 'store/types';
import getProducedResources from 'mechanics/gameTick/producedResources';
import getQuestUpdates, { LogUpdate, QuestUpdate } from 'mechanics/gameTick/quests';
import getRngState from 'mechanics/gameTick/rngState';
import getHarvest, { HarvestUpdate } from 'mechanics/gameTick/harvest';
import { /*lastAdventurerAction, */ AppMiddlewareAPI } from './utils';
import { State as seedrandomStateType } from 'seedrandom';
import { ResourceStoreState } from 'store/types/resources';
import { GameAction } from 'store/actions/game';

type ExtendedProps = {
  rngState: seedrandomStateType | null, 
  resources: ResourceStoreState | null, 
  quests: QuestUpdate[], 
  harvest: HarvestUpdate | null, 
  log: LogUpdate[]
};

export type GameTickActionExt = Extract<GameAction, { type: 'gameTick' }> & ExtendedProps;

export const gameTickMiddleware: Middleware<
ExtendedProps,
StoreState
> = (storeApi: AppMiddlewareAPI) => next => (action: Action) => {
  
  if (action.type === 'gameTick') {
    const state = storeApi.getState();
    const delta = action.delta;
    const log: LogUpdate[] = [];
    const resources = getProducedResources(state.engine.lastProducedUpdate, state);
    const harvest = getHarvest(state);
    const rngState = getRngState();
    const { quests, logUpdates } = getQuestUpdates(delta, storeApi as Store<StoreState>);
    log.push(...logUpdates);

    next({
      ...action,
      resources,
      harvest,
      rngState,
      quests,
      log,
    });

  } else {
    next(action);
  }

};
