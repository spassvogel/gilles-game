// tslint:disable:object-literal-sort-keys

export interface EngineStoreState {
    previousTick: number;
    lastTick: number;
    lastProducedUpdate: number;
}

export const initialState: EngineStoreState = {
    previousTick: Date.now(),
    lastTick: Date.now(),
    lastProducedUpdate: Date.now()
};
