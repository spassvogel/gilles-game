import { TextEntry } from "constants/text";
import { createSelector } from "reselect";
import { StoreState } from "stores";
import { LogChannel, LogEntry } from "stores/logEntry";
import { QuestStatus, QuestStoreState } from "stores/quest";

const getQuests = (state: StoreState) => state.quests;
const getLog = (state: StoreState) => state.log;

const activeQuests = (quests: QuestStoreState[]) => {
    // returns the names of the active quests
    return quests.filter((q) => q.status === QuestStatus.active).map((q) => q);
};

export const selectActiveQuests = createSelector([
    getQuests],
    activeQuests,
);

/**
 * Returns the most recent log entry for a given quest
 */
export const selectLastQuestLogEntry = (state: StoreState, questName: string) => createSelector([
    getLog],
    (log: LogEntry[]): TextEntry | undefined => {
        const questLog = log.find((l) => l.channel === LogChannel.quest && l.channelContext === questName);
        return questLog;
    },
)(state);

/**
 * Returns all log entries for given quest
 */
export const selectQuestLogEntries = (state: StoreState, questName: string) => createSelector([
    getLog],
    (log: LogEntry[]): TextEntry[] | undefined => {
        return log.filter((l) => l.channel === LogChannel.quest && l.channelContext === questName);
    },
)(state);
