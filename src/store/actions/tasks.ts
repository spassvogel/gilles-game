import { type Action } from '.'
import { type TaskType } from 'store/types/task'

export type TaskAction = {
  type: 'start'
  taskType: TaskType
  name: string
  origin: string
  time: number
  callbacks: Action[]
}

export function startTask (taskType: TaskType, name: string, origin: string, time: number, callbacks: Action[]): TaskAction {
  return {
    type: 'start',
    taskType,
    name,
    origin,
    time,
    callbacks
  }
}
