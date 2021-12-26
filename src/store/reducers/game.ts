import { Reducer } from "redux";
import { GameAction } from "store/actions/game";
import { GameStoreState } from "store/types/game";
import * as Version from "constants/version";

const initial: GameStoreState = {
  version: Version.asInt
}
/**
 * reducer
 * @param state
 * @param action
 */
export const game: Reducer<GameStoreState, GameAction> = (state = initial) => {
  return state;
};
