// tslint:disable:object-literal-sort-keys
import { LogUpdate, QuestUpdate } from "mechanics/gameTick/quests";
import { State as seedrandomStateType } from "seedrandom";
import { ResourceStoreState } from "stores/resources";

export enum ActionType {
    gameTick = "gameTick",
}
export interface GameTickAction {
    type: ActionType;
    delta: number;
    rngState: seedrandomStateType | null;
    resources: ResourceStoreState;
    quests: QuestUpdate[];
    log: LogUpdate[];
}

// export type IncrementResource = IncrementResource // | others

// tslint:disable: align
export function gameTick(delta: number,
    rngState: seedrandomStateType | null,
    resources: ResourceStoreState,
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
