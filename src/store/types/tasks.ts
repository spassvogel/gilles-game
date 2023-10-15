import { type TaskStoreState } from './task'

export type TasksStoreState = {
  running: TaskStoreState[]
  completed: TaskStoreState[]
}
