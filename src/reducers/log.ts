import { ActionType as GameActionType, GameTickAction } from "actions/game";
import { ActionType, AddLogEntryAction } from "actions/log";
import { LogUpdate } from "mechanics/gameTick/quests";
import { AnyAction, Reducer } from "redux";
import { LogEntry } from "stores/logEntry";

/**
 * reducer
 * @param state
 * @param action
 */
export const log: Reducer<LogEntry[]> = (state: LogEntry[] = [], action: AnyAction) => {
    switch (action.type) {
        case ActionType.addLogEntry:
            const { key, channel, context } = (action as AddLogEntryAction);
            const time = Date.now();
            return [{
                    channel,
                    context,
                    key,
                    time,
                },
                ...state,
            ];

        case GameActionType.gameTick:
            return gameTick(state, action as GameTickAction);
    }
    return state;
};

const gameTick = (state: LogEntry[], action: GameTickAction): LogEntry[] => {
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
};
