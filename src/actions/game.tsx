import * as constants from "../constants";

export interface GameTick {
    type: constants.GAME_TICK;
}

// export type IncrementResource = IncrementResource // | others

export function gameTick(): GameTick {
    return {
        type: constants.GAME_TICK,
    };
}
