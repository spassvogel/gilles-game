// tslint:disable:object-literal-sort-keys
export enum ActionType {
    addGold = "addGold",
}

export interface Action {
    type: ActionType;
}

export interface ModifyGoldAction extends Action {
    amount: number;
}

export function addGold(amount: number): ModifyGoldAction {
    return {
        type: ActionType.addGold,
        amount,
    };
}
export function subtractGold(amount: number): ModifyGoldAction {
    return {
        type: ActionType.addGold,
        amount: -amount,
    };
}
