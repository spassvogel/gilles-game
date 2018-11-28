import { Reducer } from 'redux';
import { TaskStoreState, initialState } from 'src/stores/taskStoreState';
import { ActionType, Action as AnyTaskAction, AddAction} from 'src/actions/tasks';


/**
 * Tasks reducer
 * @param state 
 * @param action 
 */
export const scheduledTasks:Reducer<TaskStoreState[]> = (state:TaskStoreState[] = initialState, action:AnyTaskAction) => {
    switch (action.type) {
        case ActionType.start:
            const task:TaskStoreState = createTask(action as AddAction);            
            return state.concat(task);

        case ActionType.update:
            const now:number = Date.now();
            const result = state.map((t) => {
                const end = now + t.timeRemaining;
                const progress = (now - t.startTime) / (end - t.startTime);
;                return { ...t,
                    timeRemaining: t.timeRemaining - (now - t.lastTick),
                    progress,
                    lastTick: now
                };
            });
            console.log(result[0])

            return result;
    } 
    return state;
}

const createTask = (action:AddAction) => {
    return {
        name: action.name,
        origin: action.origin,
        type: action.taskType,
        timeRemaining: action.time,
        startTime: Date.now(),
        lastTick: Date.now(),
        progress: 0
    }
}