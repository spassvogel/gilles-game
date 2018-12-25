// tslint:disable:object-literal-sort-keys
import { seedrandomStateType } from "seedrandom";
import { ResourceStoreState } from "src/stores/resources";

export enum ActionType {
    gameTick = "gameTick",
}
export interface GameTickAction {
    type: ActionType;
    rngState: seedrandomStateType | null;
    resources: ResourceStoreState;
}

// export type IncrementResource = IncrementResource // | others

export function gameTick(rngState: seedrandomStateType | null, resources: ResourceStoreState): GameTickAction {
    return {
        type: ActionType.gameTick,
        rngState,
        resources,
    };
}
