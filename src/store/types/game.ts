export interface GameStoreState {
  version: number;
  ignoreVersionDiff?: number; // ignore version warning when client is at this version
}
