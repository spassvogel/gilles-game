import { createSelector } from "reselect";
import { StoreState } from "stores";
import { QuestStatus, QuestStoreState } from "stores/quest";

const getQuests = (state: StoreState) => state.quests;
const getWorkers = (state: StoreState) => state.workers;

const activeQuests = (quests: QuestStoreState[]) => {
    // returns the names of the active quests
    return quests.filter((q) => q.status === QuestStatus.active).map((q) => q.name);
};

export const selectActiveQuests = createSelector([
    getQuests],
    activeQuests,
);
