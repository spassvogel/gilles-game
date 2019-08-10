import { AnyAction, Reducer } from "redux";
import { CombatStoreState, barBrawl } from 'stores/combat';

/**
 * reducer
 * @param state
 * @param action
 */
export const combat: Reducer<CombatStoreState> = (state: CombatStoreState = barBrawl, action: AnyAction) => {
    // switch (action.type) {
    //     case GameActionType.gameTick:
    //         return {
    //             ...state,
    //             lastTick: Date.now(),
    //         };
    // }
    return state;
};
