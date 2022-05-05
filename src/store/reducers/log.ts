import { LogAction } from 'store/actions/log';
import { LogUpdate } from 'mechanics/gameTick/quests';
import { Reducer } from 'redux';
import { LogEntry } from 'store/types/logEntry';
import { GameTickActionExt } from 'store/middleware/gameTick';

export const initialLogState = [];

/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const log: Reducer<LogEntry[], GameTickActionExt | LogAction> = (state: LogEntry[] = initialLogState, action) => {
  switch (action.type) {
    case 'addLogEntry': {
      const { entry, channel, channelContext } = action;
      const { key, context } = entry;
      const time = Date.now();
      return [{
        channel,
        channelContext,
        context,
        key,
        time,
      },
      ...state,
      ];
    }

    case 'gameTick': {
      if (!action.log.length) {
        return state;
      }

      // Add log entries
      const logEntries = action.log.map((lU: LogUpdate): LogEntry => {
        return {
          ...lU,
          time: Date.now(),
        };
      });
      return [
        ...logEntries,
        ...state,
      ];
    }
  }
  return state;
};

