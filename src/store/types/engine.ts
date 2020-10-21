// tslint:disable:object-literal-sort-keys

export interface EngineStoreState {
    lastTick: number;
    lastProducedUpdate: number;
}

export const initialState: EngineStoreState = {
    lastTick: Date.now(),
    lastProducedUpdate: Date.now()
};
