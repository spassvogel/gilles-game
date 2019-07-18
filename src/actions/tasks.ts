// tslint:disable:object-literal-sort-keys
import { AnyAction } from "redux";
import { TaskType } from "stores/task";

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
    callbacks: AnyAction[];
}

export function startTask(taskType: TaskType,
                          name: string, origin: string, time: number, callbacks: AnyAction[]): AddAction {
    return {
        type: ActionType.start,
        taskType,
        name,
        origin,
        time,
        callbacks,
    };
}
