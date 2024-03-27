export type GameStoreState = {
  version: number
  ignoreVersionDiff?: number // ignore version warning when client is at this version
  tutorial: number // tutorial step, -1 means
}
