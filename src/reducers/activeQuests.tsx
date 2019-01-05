import { Reducer } from "redux";
import { ActionType, QuestAction, QuestVarsAction, UpdateEncounterResultAction } from "src/actions/quests";
import { QuestStoreState } from "src/stores/quest";

// tslint:disable:object-literal-sort-keys
const initialState: QuestStoreState[] = [{
    name: "kill10boars",
    party: [],
    progress: 0,
    questVars: {},
    encounterResults: [],
}, {
    name: "retrieveMagicAmulet",
    party: [],
    progress: 0,
    questVars: {},
    encounterResults: [],
}];

/**
 * reducer
 * @param state
 * @param action
 */
export const activeQuests: Reducer<QuestStoreState[]> = (state: QuestStoreState[] = initialState,
                                                         action: QuestAction) => {
    switch (action.type) {
        case ActionType.advanceQuest:
            return advanceQuest(state, action);

        case ActionType.updateQuestVars:
            // Updates the questvars
            return updateQuestVars(state, action as QuestVarsAction);

        case ActionType.updateEncounterResult:
            return updateEncounterResult(state, action as UpdateEncounterResultAction);

    }
    return state;
};

const advanceQuest = (state: QuestStoreState[], action: QuestAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const progress = qss.progress + 1;
            return {
                ...qss,
                progress,
            };
        }
        return qss;
    });
};

const updateQuestVars = (state: QuestStoreState[], action: QuestVarsAction)  => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const questVars = Object.assign({}, qss.questVars, action.vars);
            return {
                ...qss,
                questVars,
            };
        }
        return qss;
    });
};

const updateEncounterResult = (state: QuestStoreState[], action: UpdateEncounterResultAction)  => {
    return state.map((qss: QuestStoreState) => {
        if (qss.name === action.questName) {
            const encounterResults = qss.encounterResults.concat();
            encounterResults[action.nodeIndex] = action.result;
            return {
                ...qss,
                encounterResults,
            };
        }
        return qss;
    });
};
