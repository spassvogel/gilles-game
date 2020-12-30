import { useMemo } from 'react';
import { StoreState } from 'store/types';
import { useSelector } from 'react-redux';
import { LogChannel, LogEntry } from 'store/types/logEntry';
import { createSelector } from 'reselect';

const getLog = (state: StoreState) => state.log;

// Returns the game log from redux store
export const useLog = () => {
    const log = useSelector<StoreState, LogEntry[]>(store => store.log);
    return log;
}

export const useQuestLog = (questId: string) => {
    const selectMemoized = useMemo(() => {
        const selectQuestLogEntries = createSelector(
            [getLog],
            (log: LogEntry[]) => { return log.filter((l) => l.channel === LogChannel.quest && l.channelContext === questId) }
        )
        return selectQuestLogEntries;
    }, [questId]);

    return useSelector<StoreState, LogEntry[]>(selectMemoized);
}

