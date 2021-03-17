import { LogUpdate, QuestUpdate } from "mechanics/gameTick/quests";
import { State as seedrandomStateType } from "seedrandom";
import { ResourceStoreState } from "store/types/resources";

export type GameAction = 
   { type: "gameTick", delta: number, rngState: seedrandomStateType | null, resources: ResourceStoreState | null, quests: QuestUpdate[], log: LogUpdate[] }
|  { type: "startGame" }

export const startGame = (): GameAction => ({
    type: "startGame",
})

export const gameTick = (delta: number, rngState: seedrandomStateType | null, resources: ResourceStoreState | null, quests: QuestUpdate[], log: LogUpdate[]): GameAction => ({
    type: "gameTick",
    delta,
    rngState,
    resources,
    quests,
    log,
})
