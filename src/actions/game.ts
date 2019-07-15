// tslint:disable:object-literal-sort-keys
import { State as seedrandomStateType } from "seedrandom";
import { LogUpdate, QuestUpdate } from "src/mechanics/gameTick/quests";
import { ResourceStoreState } from "src/stores/resources";

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
