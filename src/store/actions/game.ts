import { type StoreState } from 'store/types'

export type Time = 'harvest' | 'task'
export type GameAction =
  { type: 'gameTick', delta: number }
  | { type: 'startGame' }
  | { type: 'loadGame', state: StoreState }
  | { type: 'skipTutorial' }
  | { type: 'nextTutorialStep' }
  | { type: 'ignoreVersionDiff' }
  | { type: 'reduceTime', percentage: number, time: Time, what?: string }

export const startGame = (): GameAction => ({
  type: 'startGame'
})

export const gameTick = (delta: number): GameAction => ({
  type: 'gameTick',
  delta
})

export const reduceTime = (percentage: number, time: Time, what?: string): GameAction => ({
  type: 'reduceTime',
  percentage,
  time,
  what
})

export const ignoreVersionDiff = (): GameAction => ({
  type: 'ignoreVersionDiff'
})

export const loadGame = (state: StoreState): GameAction => ({
  type: 'loadGame',
  state
})

export const skipTutorial = (): GameAction => ({
  type: 'skipTutorial'
})

export const nextTutorialStep = (): GameAction => ({
  type: 'nextTutorialStep'
})
