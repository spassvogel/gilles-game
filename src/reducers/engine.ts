import { ActionType as GameActionType, GameTickAction } from "actions/game";
import { AnyAction, Reducer } from "redux";
import { EngineStoreState, initialState } from "stores/engine";

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
            return {
                ...state,
                lastProducedUpdate,
                lastTick: Date.now(),
            };
    }
    return state;
};
