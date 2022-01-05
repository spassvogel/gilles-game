import { TaskStoreState } from './task';

export interface TasksStoreState {
  running: TaskStoreState[];
  completed: TaskStoreState[];
}

