export interface Kill10BoarsQuestVars {
    dungeon: {
        entered: boolean
    },
    foo: boolean;
    bar: number;
}

export const initialQuestVars: Kill10BoarsQuestVars = {
    dungeon: {
        entered: false
    },
    foo: false,
    bar: 3
}