// tslint:disable: object-literal-sort-keys
import { Action } from "redux";
import { LogChannel } from "stores/logEntry";

export enum ActionType {
    addLogEntry = "addLogEntry",
}

export interface AddLogEntryAction extends Action<ActionType> {
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
