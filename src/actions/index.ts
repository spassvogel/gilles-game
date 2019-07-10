
export enum ActionType {
    addWorkers = "addWorkers",
}

export interface Action {
    type: ActionType;
}

export interface ModifyWorkersAction extends Action {
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
