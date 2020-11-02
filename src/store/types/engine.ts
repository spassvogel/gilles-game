// tslint:disable:object-literal-sort-keys

export interface EngineStoreState {
    gameStarted?: number;
    previousTick: number;
    lastTick: number;
    lastProducedUpdate: number;
}

export const initialState: EngineStoreState = {
    gameStarted: undefined,
    previousTick: Date.now(),
    lastTick: Date.now(),
    lastProducedUpdate: Date.now()
};
