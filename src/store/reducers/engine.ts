import { GameAction } from "store/actions/game";
import { Reducer } from "redux";
import { EngineStoreState } from "store/types/engine";

/**
 * reducer
 * @param state
 * @param action
 */
export const engine: Reducer<EngineStoreState> = (state: EngineStoreState = getInitialEngineState(), action: GameAction) => {
    switch (action.type) {
        case "startGame": {
            return {
                ...state,
                gameStarted: Date.now()
            };
        }
        case "gameTick": {

            // Keep track of the last time resources were produced
            const resourcesToAdd = action.resources;
            const lastProducedUpdate = resourcesToAdd === null ? state.lastProducedUpdate : Date.now();
            const previousTick = state.lastTick;

            return {
                ...state,
                previousTick,
                lastProducedUpdate,
                lastTick: Date.now(),
            };
        }
    }
};

export const getInitialEngineState = () => {
    return {
        gameStarted: undefined,
        previousTick: Date.now(),
        lastTick: Date.now(),
        lastProducedUpdate: Date.now()
    }
};
