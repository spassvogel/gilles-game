import { Reducer } from "redux";
import { EngineStoreState } from "store/types/engine";
import { Action } from "store/actions";

/**
 * reducer
 * @param state
 * @param action
 */
export const engine: Reducer<EngineStoreState> = (state: EngineStoreState = getInitialEngineState(), action: Action) => {
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

            // Keep track of last harvest
            const lastHarvest = action.harvest === null || !Object.keys(action.harvest).length ? state.lastHarvest : Date.now();

            const previousTick = state.lastTick;

            return {
                ...state,
                previousTick,
                lastProducedUpdate,
                lastTick: Date.now(),
                lastHarvest
            };
        }
        
        case "reduceTime": {
            if (action.percentage < 0 || action.percentage > 100) return state;
            switch (action.time) { 
                case "harvest": {
                    const timeLeft = Date.now() - state.lastHarvest;
                    const delta = timeLeft * (action.percentage / 100);
                    return {
                        ...state,
                        lastHarvest: state.lastHarvest - delta
                    }
                }
            }
            return state;
        }
    }
    return state;
};

export const getInitialEngineState = () => {
    return {
        gameStarted: undefined,
        previousTick: Date.now(),
        lastTick: Date.now(),
        lastProducedUpdate: Date.now(),
        lastHarvest: Date.now()
    }
};
