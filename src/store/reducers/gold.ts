import { GoldAction } from "store/actions/gold";
import { Reducer } from "redux";

/**
 * reducer
 * @param state
 * @param action
 */
export const gold: Reducer<number, GoldAction> = (state = initialGoldState, action) => {
  switch (action.type) {
    case "addGold":
      // Adds (or subtract, if negative) gold from the players gold supply
      return state + action.amount;
  }
  return state;
};

export const initialGoldState = 40;
