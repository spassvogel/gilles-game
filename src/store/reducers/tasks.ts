
import { TaskAction } from 'store/actions/tasks';
import { Reducer } from 'redux';
import { TaskStoreState } from 'store/types/task';
import { TasksStoreState } from 'store/types/tasks';
import { GameAction } from 'store/actions/game';

const createTask = (action: TaskAction): TaskStoreState => {
  return {
    name: action.name,
    origin: action.origin,
    type: action.taskType,
    callbacks: action.callbacks,
    timeRemaining: action.time,
    startTime: Date.now(),
    lastTick: Date.now(),
    progress: 0,
  };
};

export const initialTasksState: TasksStoreState = {
  completed: [],
  running: [],
};

/**
 * Tasks reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const tasks: Reducer<TasksStoreState, TaskAction | GameAction> = (state: TasksStoreState = initialTasksState, action) => {
  switch (action.type) {
    case 'start': {
    // Adds a new task to the running tasks
      const task: TaskStoreState = createTask(action);
      const running = state.running.concat(task);
      return {
        ...state,
        running,
      };
    }
    case 'gameTick': {
      // Will update all tasks in `running`. If a running task expires it is placed in `complete`
      // Note that completed tasks must be handled BEFORE the next call to ActionType.update, because
      // this list is recreated every time
      const now: number = Date.now();
      const running: TaskStoreState[] = [];
      const completed: TaskStoreState[] = [];
      state.running.forEach((t) => {
        const end = now + t.timeRemaining;
        const progress = (now - t.startTime) / (end - t.startTime);
        const timeRemaining = t.timeRemaining - (now - t.lastTick);
        const task = {
          ...t,
          progress,
          lastTick: now,
          timeRemaining,
        };
        if (timeRemaining < 0) {
          completed.push(task);
        } else {
          running.push(task);
        }
      });

      return {
        running,
        completed,
      };
    }
    case 'reduceTime': {
      if (action.percentage < 0 || action.percentage > 100) return state;
      if (action.time === 'task') {
        const running: TaskStoreState[] = [];
        state.running.forEach((t) => {
          const timeRemaining = t.timeRemaining / 100 * action.percentage;
          if (t.name === action.what) {
            const task = {
              ...t,
              timeRemaining,
            };
            running.push(task);
          } else {
            running.push(t);
          }
        });
        return {
          ...state,
          running,
        };
      }
      return state;
    }
  }
  return state;
};
