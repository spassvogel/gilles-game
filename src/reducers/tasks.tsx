// tslint:disable:object-literal-sort-keys

import { Reducer } from "redux";
import { ActionType as GameActionType, GameTickAction } from "src/actions/game";
import { Action as AnyTaskAction, ActionType, AddAction} from "src/actions/tasks";
import { TaskStoreState } from "src/stores/task";
import { initialState, TasksStoreState } from "src/stores/tasks";

/**
 * Tasks reducer
 * @param state
 * @param action
 */
export const tasks: Reducer<TasksStoreState> = (state: TasksStoreState = initialState,
                                                action: AnyTaskAction | GameTickAction ) => {
    switch (action.type) {
        case ActionType.start: {
        // Adds a new task to the running tasks
            const task: TaskStoreState = createTask(action as AddAction);
            const running = state.running.concat(task);
            return {
                ...state,
                running,
            };
        }
        case GameActionType.gameTick: {
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
    }
    return state;
};

const createTask = (action: AddAction) => {
    return {
        name: action.name,
        origin: action.origin,
        type: action.taskType,
        callback: action.callback,
        timeRemaining: action.time,
        startTime: Date.now(),
        lastTick: Date.now(),
        progress: 0,
    };
};
