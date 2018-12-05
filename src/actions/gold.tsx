export enum ActionType {
    addGold = "addGold",
}

export interface Action {
    type: ActionType;
}

export interface ModifyGoldAction extends Action {
    value: number;
}

export function addGold(value: number): ModifyGoldAction {
    return {
        type: ActionType.addGold,
        value,
    };
}
export function subtractGold(value: number): ModifyGoldAction {
    return {
        type: ActionType.addGold,
        value: -value,
    };
}
