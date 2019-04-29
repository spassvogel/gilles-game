import { AnyAction, Reducer } from "redux";
import { Action as StructureAction,
    ActionType as StructureActionType } from "src/actions/structures";
import structureDefinitions, { Structure } from "src/definitions/structures";
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
            return [
                { key, context },
                ...state,
            ];

    }
    return state;
};
