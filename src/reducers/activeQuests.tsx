import { Reducer } from "redux";
import { ActionType, QuestAction, QuestVarsAction, UpdateEncounterResultAction } from "src/actions/quests";
import { QuestStoreState } from "src/stores/quest";

// tslint:disable:object-literal-sort-keys
const initialState: QuestStoreState[] = [{
    name: "kill10boars",
    party: [
        "c4a5d270-11e7-11e9-b7ad-4134e879f440",
        "2e655832-65c9-484d-81d7-07938253cf4d",
        "ec6f1050-11e7-11e9-b13b-654a21c6ca63",
        "d299f98a-8f30-4684-b4b5-81baadb388b2",
    ],
    progress: 0,
    questVars: {},
    encounterResults: [],
}, {
    name: "retrieveMagicAmulet",
    party: [
        "96c686c3-2756-4cf7-9301-92f5ab857b8a",
        "250d1a9d-a421-4841-9a89-ee6d6d691339",
        "169384ef-f036-4392-a3ca-8eb8e08e3eb8",
        "f22d66cb-43e0-46ab-93c1-d9ed3800bde0",
    ],
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
