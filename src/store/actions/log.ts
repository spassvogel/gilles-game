import { LogChannel } from "store/types/logEntry";
import { TextEntry } from 'constants/text';

export type LogAction =
  { type: "addLogEntry", entry: TextEntry, channel: LogChannel, channelContext?: string }


export const addLogText = (key: string, context?: unknown, channel: LogChannel = LogChannel.common, channelContext?: string): LogAction => {
  const entry: TextEntry = {
    key,
    context
  };
  return {
    type: "addLogEntry",
    entry,
    channel,
    channelContext,
  };
}

export const addLogEntry = (entry: TextEntry, channel: LogChannel = LogChannel.common, channelContext?: string): LogAction => ({
  type: "addLogEntry",
  entry,
  channel,
  channelContext,
});
