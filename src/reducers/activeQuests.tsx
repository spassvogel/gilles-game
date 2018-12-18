import { Reducer } from "redux";
import { Action, ActionType, ModifyGoldAction } from "src/actions/gold";
import { QuestStoreState } from "src/stores/quest";

/**
 * reducer
 * @param state
 * @param action
 */
export const activeQuests: Reducer<QuestStoreState[]> = (state: QuestStoreState[] = [], action: Action) => {
    // switch (action.type) {
    // }
    return state;
};
