import { LogChannel } from "src/stores/logEntry";

export enum ActionType {
    addLogEntry = "addLogEntry",
}

export interface Action {
    type: ActionType;
}

export interface AddLogEntryAction extends Action {
    key: string;
    channel: LogChannel;
    context?: any;
}

export function addLogEntry(key: string, channel: LogChannel = LogChannel.common, context?: any): AddLogEntryAction {
    return {
        type: ActionType.addLogEntry,
        key,
        channel,
        context,
    };
}
