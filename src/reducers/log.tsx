import { AnyAction, Reducer } from "redux";
import { ActionType, AddLogEntryAction } from "src/actions/log";
import { LogEntry } from "src/stores/logEntry";

/**
 * reducer
 * @param state
 * @param action
 */
export const log: Reducer<LogEntry[]> = (state: LogEntry[] = [], action: AnyAction) => {
    switch (action.type) {
        case ActionType.addLogEntry:
            const { key, context } = (action as AddLogEntryAction);
            const time = Date.now();
            return [{
                    context,
                    key,
                    time,
                },
                ...state,
            ];

    }
    return state;
};
