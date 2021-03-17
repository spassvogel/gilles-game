import { GameAction } from "store/actions/game";
import {  LogAction } from "store/actions/log";
import { LogUpdate } from "mechanics/gameTick/quests";
import { Reducer } from "redux";
import { LogEntry } from "store/types/logEntry";

/**
 * reducer
 * @param state
 * @param action
 */
export const log: Reducer<LogEntry[]> = (state: LogEntry[] = initialLogState, action: GameAction | LogAction) => {
    switch (action.type) {
        case "addLogEntry": {
            const {entry, channel, channelContext} = action;
            const {key, context} = entry;
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
        case "gameTick": {
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

export const initialLogState = [];
