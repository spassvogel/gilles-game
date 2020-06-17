import { Action } from "redux";
import { LogChannel } from "stores/logEntry";
import { TextEntry } from 'constants/text';

export enum ActionType {
    addLogEntry = "addLogEntry",
}

export interface AddLogEntryAction extends Action<ActionType> {
    entry: TextEntry;
    channel: LogChannel;
    channelContext?: string;
}

export function addLogText(key: string, context?: any, channel: LogChannel = LogChannel.common, channelContext?: string): AddLogEntryAction {
    const entry: TextEntry = {
        key,
        context
    };
    return {
        type: ActionType.addLogEntry,
        entry,
        channel,
        channelContext,
    };
}

export function addLogEntry(entry: TextEntry, channel: LogChannel = LogChannel.common, channelContext?: string): AddLogEntryAction {
    return {
        type: ActionType.addLogEntry,
        entry,
        channel,
        channelContext,
    };
}
