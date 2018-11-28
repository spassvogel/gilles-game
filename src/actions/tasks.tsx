import { TaskType } from 'src/stores/taskStoreState';

export enum ActionType {
    start = "startTask",
    update = "updateTasks"
}

export interface Action {
    type:ActionType
}

export interface AddAction extends Action {
    taskType:TaskType,
    name:string,
    origin:string,
    time:number
}

export function startTask(taskType:TaskType, name:string, origin: string, time:number): AddAction {
    console.log(`Scheduling a new task ${name} (${origin}) now! `);
    return {
        type: ActionType.start,
        taskType,
        name,
        origin,
        time
    }
}

export function updateTasks(): Action {
    return {
        type: ActionType.update
    }
}
