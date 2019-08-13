// tslint:disable:object-literal-sort-keys
import { Action, AnyAction } from "redux";
import { TaskType } from "stores/task";

export enum ActionType {
    startAction = "startAction",
}

export interface AddAction extends Action<ActionType> {
    taskType: TaskType;
    name: string;
    origin: string;
    time: number;
    callbacks: AnyAction[];
}

export function startTask(taskType: TaskType,
                          name: string, origin: string, time: number, callbacks: AnyAction[]): AddAction {
    return {
        type: ActionType.startAction,
        taskType,
        name,
        origin,
        time,
        callbacks,
    };
}
