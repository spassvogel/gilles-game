import { type TextEntry } from 'constants/text'

export enum LogChannel {
  common, // Only visible in 'all'
  town, // Visible in 'all' and town
  quest, // Visible in 'all' and the appropriate quest tab
}

export type LogEntry = {
  time: number
  channel: LogChannel
  channelContext?: string
} & TextEntry
