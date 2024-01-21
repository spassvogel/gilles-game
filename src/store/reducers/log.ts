import { type LogAction } from 'store/actions/log'
import { type LogUpdate } from 'mechanics/gameTick/quests'
import { type Reducer } from 'redux'
import { type LogEntry } from 'store/types/logEntry'
import { type GameTickActionExt } from 'store/middleware/gameTick'

export const initialLogState = []

/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const log: Reducer<LogEntry[], GameTickActionExt | LogAction> = (state: LogEntry[] = initialLogState, action) => {
  switch (action.type) {
    case 'addLogEntry': {
      const { entry, channel, channelContext } = action
      const { key, context } = entry
      const time = Date.now()

      return [
        ...state, {
          channel,
          channelContext,
          context,
          key,
          time
        }
      ]
    }

    case 'gameTick': {
      if (action.log.length === 0) {
        return state
      }

      // Add log entries
      const logEntries = action.log.map((lU: LogUpdate): LogEntry => {
        return {
          ...lU,
          time: Date.now()
        }
      })
      return [
        ...state,
        ...logEntries
      ]
    }
  }
  return state
}
