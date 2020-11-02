import { LogUpdate, QuestUpdate } from "mechanics/gameTick/quests";
import { Action } from "redux";
import { State as seedrandomStateType } from "seedrandom";
import { ResourceStoreState } from "store/types/resources";

export enum ActionType {
    gameTick = "gameTick",
    startGame = "startGame"
}
export interface GameTickAction extends Action<ActionType> {
    delta: number;
    rngState: seedrandomStateType | null;
    resources: ResourceStoreState | null;
    quests: QuestUpdate[];
    log: LogUpdate[];
}

export function startGame(): Action {
    return {
        type: ActionType.startGame,
    };
}

export function gameTick(delta: number,
    rngState: seedrandomStateType | null,
    resources: ResourceStoreState | null,
    quests: QuestUpdate[],
    log: LogUpdate[],
): GameTickAction {
    return {
        type: ActionType.gameTick,
        delta,
        rngState,
        resources,
        quests,
        log,
    };
}
