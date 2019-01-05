import { AnyAction, Reducer } from "redux";
import { ActionType as GameActionType, GameTickAction } from "src/actions/game";
import { EngineStoreState, initialState } from "src/stores/engine";

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
