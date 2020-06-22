import { ActionType, ModifyGoldAction } from "actions/gold";
import { AnyAction, Reducer } from "redux";

/**
 * reducer
 * @param state
 * @param action
 */
export const gold: Reducer<number> = (state: number = 0, action: AnyAction) => {
    switch (action.type) {
        case ActionType.addGold:
            console.log("addgold", (action as ModifyGoldAction).amount)
            // Adds (or subtract, if negative) gold from the players gold supply
            return state + (action as ModifyGoldAction).amount;
    }
    return state;
};
