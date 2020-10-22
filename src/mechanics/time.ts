export enum TimeType {
    questProgress,          // progress on the worldmap
    resourceGeneration, 
    cheat
}
// todo: should come from store?

let cheatTimeMultiplier = 1;
export const setCheatTimeMultiplier = (value: number) => {
    cheatTimeMultiplier = value;
}

export const getTimeMultiplier = (type: TimeType): number => {
    switch (type) {
       case TimeType.cheat:
            return cheatTimeMultiplier;
        // todo: implement different multipliers for different timetypes?
        // the idea is to have speed boosts in different areas of the game
        default:
            return cheatTimeMultiplier;
    }
}

