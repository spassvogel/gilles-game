import { HarvestUpdate } from "mechanics/gameTick/harvest";
import { LogUpdate, QuestUpdate } from "mechanics/gameTick/quests";
import { State as seedrandomStateType } from "seedrandom";
import { StoreState } from "store/types";
import { ResourceStoreState } from "store/types/resources";

export type Time = "harvest" | "task"
export type GameAction =
  { type: "gameTick", delta: number, rngState: seedrandomStateType | null, resources: ResourceStoreState | null, quests: QuestUpdate[], harvest: HarvestUpdate | null, log: LogUpdate[] }
| { type: "startGame" }
| { type: "loadGame", state: StoreState }
| { type: "ignoreVersionDiff" }
| { type: "reduceTime", percentage: number, time: Time, what?: string}


export const startGame = (): GameAction => ({
  type: "startGame",
})

export const gameTick = (delta: number, rngState: seedrandomStateType | null, resources: ResourceStoreState | null, quests: QuestUpdate[], harvest: HarvestUpdate | null, log: LogUpdate[]): GameAction => ({
  type: "gameTick",
  delta,
  rngState,
  resources,
  quests,
  harvest,
  log,
})

export const reduceTime = (percentage: number, time: Time, what?: string): GameAction => ({
  type: "reduceTime",
  percentage,
  time,
  what
})

export const ignoreVersionDiff = () => ({
  type: "ignoreVersionDiff"
})

export const loadGame = (state: StoreState) => ({
  type: "loadGame",
  state
})
