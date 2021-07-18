import { HarvestUpdate } from "mechanics/gameTick/harvest";
import { LogUpdate, QuestUpdate } from "mechanics/gameTick/quests";
import { State as seedrandomStateType } from "seedrandom";
import { ResourceStoreState } from "store/types/resources";

export type Time = "harvest" 
export type GameAction = 
   { type: "gameTick", delta: number, rngState: seedrandomStateType | null, resources: ResourceStoreState | null, quests: QuestUpdate[], harvest: HarvestUpdate | null, log: LogUpdate[] }
|  { type: "startGame" }
|  { type: "reduceTime", percentage: number, time: Time }


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

export const reduceTime = (delta: number, percentage: number, time: Time): GameAction => ({
    type: "reduceTime",
    percentage,
    time
})
