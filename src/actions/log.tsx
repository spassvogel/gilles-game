// tslint:disable:object-literal-sort-keys
export enum ActionType {
    addLogEntry = "addLogEntry",
}

export interface Action {
    type: ActionType;
}

export interface AddLogEntryAction extends Action {
    key: string,
    context?: any,
}

export function addLogEntry(key: string, context?: any): AddLogEntryAction {
    return {
        type: ActionType.addLogEntry,
        key,
        context,
    };
}
