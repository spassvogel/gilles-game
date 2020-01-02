// tslint:disable:object-literal-sort-keys
import { LogUpdate, QuestUpdate } from "mechanics/gameTick/quests";
import { Action } from "redux";
import { State as seedrandomStateType } from "seedrandom";
import { ResourceStoreState } from "stores/resources";

export enum ActionType {
    gameTick = "gameTick",
}
export interface GameTickAction extends Action<ActionType> {
    delta: number;
    rngState: seedrandomStateType | null;
    resources: ResourceStoreState | null;
    quests: QuestUpdate[];
    log: LogUpdate[];
}

// export type IncrementResource = IncrementResource // | others

// tslint:disable: align
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
