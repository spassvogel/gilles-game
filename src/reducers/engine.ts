import { AnyAction, Reducer } from "redux";
import { ActionType as GameActionType } from "actions/game";
import { EngineStoreState, initialState } from "stores/engine";

/**
 * reducer
 * @param state
 * @param action
 */
export const engine: Reducer<EngineStoreState> = (state: EngineStoreState = initialState, action: AnyAction) => {
    switch (action.type) {
        case GameActionType.gameTick:
            return {
                ...state,
                lastTick: Date.now(),
            };
    }
    return state;
};
