// tslint:disable:object-literal-sort-keys
import { seedrandomStateType } from "seedrandom";

export enum ActionType {
    gameTick = "gameTick",
}
export interface GameTick {
    type: ActionType;
    rngState: seedrandomStateType;
}

// export type IncrementResource = IncrementResource // | others

export function gameTick(rngState: seedrandomStateType): GameTick {
    return {
        type: ActionType.gameTick,
        rngState,
    };
}
