// tslint:disable:object-literal-sort-keys
import { seedrandomStateType } from "seedrandom";

export enum ActionType {
    gameTick = "gameTick",
}
export interface GameTickAction {
    type: ActionType;
    rngState: seedrandomStateType;
}

// export type IncrementResource = IncrementResource // | others

export function gameTick(rngState: seedrandomStateType): GameTickAction {
    return {
        type: ActionType.gameTick,
        rngState,
    };
}
