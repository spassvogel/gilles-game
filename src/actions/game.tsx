// tslint:disable:object-literal-sort-keys
import { State as seedrandomStateType } from "seedrandom";
import { ResourceStoreState } from "src/stores/resources";

export enum ActionType {
    gameTick = "gameTick",
}
export interface GameTickAction {
    type: ActionType;
    delta: number;
    rngState: seedrandomStateType | null;
    resources: ResourceStoreState;
}

// export type IncrementResource = IncrementResource // | others

export function gameTick(delta: number,
                         rngState: seedrandomStateType | null,
                         resources: ResourceStoreState): GameTickAction {
    return {
        type: ActionType.gameTick,
        delta,
        rngState,
        resources,
    };
}
