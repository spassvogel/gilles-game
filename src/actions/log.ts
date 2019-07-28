// tslint:disable: object-literal-sort-keys
import { LogChannel } from "stores/logEntry";

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
    channelContext?: string;
}

export function addLogEntry(key: string, context?: any, channel: LogChannel = LogChannel.common, channelContext?: string): AddLogEntryAction {
    return {
        type: ActionType.addLogEntry,
        key,
        channel,
        channelContext,
        context,
    };
}
