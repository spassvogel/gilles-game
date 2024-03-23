import { type Action } from 'store/actions'

export enum TaskType {
  buildStructure,
  upgradeStructure,
  craftItem,
  studyItem,
}

export type TaskStoreState = {
  type: TaskType
  name: string
  origin: string
  startTime: number // time the task was scheduled
  lastTick: number // time of last tick
  timeRemaining: number
  progress: number // value between 0 and 1 indicating progress
  callbacks: Action[] // actions to dispatch on complete
}
