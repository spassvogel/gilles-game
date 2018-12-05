// tslint:disable:object-literal-sort-keys
import { AnyAction } from "redux";
import { TaskType } from "src/stores/task";

export enum ActionType {
    start = "startTask",
    update = "updateTasks",
}

export interface Action {
    type: ActionType;
}

export interface AddAction extends Action {
    taskType: TaskType;
    name: string;
    origin: string;
    time: number;
    callback: AnyAction;
}

export function startTask(taskType: TaskType,
                          name: string, origin: string, time: number, callback: AnyAction): AddAction {
    return {
        type: ActionType.start,
        taskType,
        name,
        origin,
        time,
        callback,
    };
}

export function updateTasks(): Action {
    return {
        type: ActionType.update,
    };
}
