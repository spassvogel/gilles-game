import { Action } from "redux";

// todo this should go somewhere else
export enum ActionType {
    addWorkers = "addWorkers",
}



export interface ModifyWorkersAction extends Action<ActionType> {
    value: number;
}

export function addWorkers(value: number): ModifyWorkersAction {
    return {
        type: ActionType.addWorkers,
        value,
    };
}
export function subtractWorkers(value: number): ModifyWorkersAction {
    return {
        type: ActionType.addWorkers,
        value: -value,
    };
}
