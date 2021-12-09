export interface EngineStoreState {
  gameStarted?: number;
  previousTick: number;
  lastTick: number;
  lastProducedUpdate: number;
  lastHarvest: number;
}
