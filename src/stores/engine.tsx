// tslint:disable:object-literal-sort-keys

export interface EngineStoreState {
    lastTick: number;
}

export const initialState: EngineStoreState = {
    lastTick: Date.now(),
};
