// tslint:disable:object-literal-sort-keys

export interface EngineStoreState {
    gameStarted?: number;
    previousTick: number;
    lastTick: number;
    lastProducedUpdate: number;
}
