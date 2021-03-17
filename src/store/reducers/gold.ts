import { GoldAction } from "store/actions/gold";
import { Reducer } from "redux";
import { Action } from "store/actions";

/**
 * reducer
 * @param state
 * @param action
 */
export const gold: Reducer<number, GoldAction> = (state: number = initialGoldState, action: Action) => {
    switch (action.type) {
        case "addGold":
            // Adds (or subtract, if negative) gold from the players gold supply
            return state + action.amount;
    }
    return state;
};

export const initialGoldState = 40;