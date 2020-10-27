import { ActionType as GameActionType, GameTickAction } from "store/actions/game";
import { AnyAction, Reducer } from "redux";
import { EngineStoreState, initialState } from "store/types/engine";

/**
 * reducer
 * @param state
 * @param action
 */
export const engine: Reducer<EngineStoreState> = (state: EngineStoreState = initialState, action: AnyAction) => {
    switch (action.type) {
        case GameActionType.gameTick:

            // Keep track of the last time resources were produced
            const resourcesToAdd = (action as GameTickAction).resources;
            const lastProducedUpdate = resourcesToAdd === null ? state.lastProducedUpdate : Date.now();
            const previousTick = state.lastTick;

            return {
                ...state,
                previousTick,
                lastProducedUpdate,
                lastTick: Date.now(),
            };
    }
    return state;
};
