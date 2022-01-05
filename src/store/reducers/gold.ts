import { GoldAction } from 'store/actions/gold';
import { Reducer } from 'redux';

export const initialGoldState = 40;
/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const gold: Reducer<number, GoldAction> = (state = initialGoldState, action) => {
  switch (action.type) {
    case 'addGold':
      // Adds (or subtract, if negative) gold from the players gold supply
      return state + action.amount;
  }
  return state;
};

