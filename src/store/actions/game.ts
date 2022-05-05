import { StoreState } from 'store/types';

export type Time = 'harvest' | 'task';
export type GameAction =
  { type: 'gameTick', delta: number }
  | { type: 'startGame' }
  | { type: 'loadGame', state: StoreState }
  | { type: 'ignoreVersionDiff' }
  | { type: 'reduceTime', percentage: number, time: Time, what?: string };


export const startGame = (): GameAction => ({
  type: 'startGame',
});

export const gameTick = (delta: number): GameAction => ({
  type: 'gameTick',
  delta,
});

export const reduceTime = (percentage: number, time: Time, what?: string): GameAction => ({
  type: 'reduceTime',
  percentage,
  time,
  what,
});

export const ignoreVersionDiff = () => ({
  type: 'ignoreVersionDiff',
});

export const loadGame = (state: StoreState) => ({
  type: 'loadGame',
  state,
});
