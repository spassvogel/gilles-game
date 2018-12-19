import { Reducer, AnyAction } from "redux";
import { QuestStoreState } from "src/stores/quest";
import { Action, ActionType, QuestAction } from "src/actions/quests";


const initialState: QuestStoreState[] = [{
    name: "kill10boars",
    party: [],
    progress: 0,
    questVars: {},
}, {
    name: "retrieveMagicAmulet",
    party: [],
    progress: 0,
    questVars: {},
}];

/**
 * reducer
 * @param state
 * @param action
 */
export const activeQuests: Reducer<QuestStoreState[]> = (state: QuestStoreState[] = initialState, action: Action) => {
    switch (action.type) {
        case ActionType.advanceQuest: {
            return state.map((qss) => {
                if(qss.name === (action as QuestAction).questName) {
                    const progress = qss.progress + 1;
                    return {
                        ...qss,
                        progress,
                    };
                }
                return qss;
            });
        }
    }
    return state;
};
