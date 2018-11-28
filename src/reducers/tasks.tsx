import { Reducer } from 'redux';
import { TaskStoreState } from 'src/stores/task';
import { TasksStoreState, initialState } from 'src/stores/tasks';
import { ActionType, Action as AnyTaskAction, AddAction} from 'src/actions/tasks';


/**
 * Tasks reducer
 * @param state 
 * @param action 
 */
export const tasks:Reducer<TasksStoreState> = (state:TasksStoreState = initialState, action:AnyTaskAction) => {
    switch (action.type) {
        case ActionType.start: {
        // Adds a new task to the running tasks
            const task:TaskStoreState = createTask(action as AddAction);
            const running = state.running.concat(task);            
            return { 
                ...state,
                running 
            };
        }
        case ActionType.update: {
            const now:number = Date.now();
            const running = state.running.map((t) => {
                const end = now + t.timeRemaining;
                const progress = (now - t.startTime) / (end - t.startTime);
;                return { ...t,
                    timeRemaining: t.timeRemaining - (now - t.lastTick),
                    progress,
                    lastTick: now
                };
            });
            //console.log(result[0])

            return { 
                running,
                completed: []
            };
        }
    } 
    return state;
}

const createTask = (action:AddAction) => {
    return {
        name: action.name,
        origin: action.origin,
        type: action.taskType,
        callback: action.callback,
        timeRemaining: action.time,
        startTime: Date.now(),
        lastTick: Date.now(),
        progress: 0
    }
}