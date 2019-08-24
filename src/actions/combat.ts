// tslint:disable:object-literal-sort-keys
import { Action, AnyAction } from "redux";
import { Actor, CombatActionType } from "stores/combat";
import { TaskType } from "stores/task";

export enum ActionType {
    startAction = "startAction",
}

export interface AddAction extends Action<ActionType> {
    combatType: CombatActionType;
    actor: Actor;
    target: number[];
    endsAt: number;
}

export function startCombatAction(type: CombatActionType, actor: Actor, target: number[], endsAt: number): AddAction {
    return {
        type: ActionType.startAction,
        combatType: type,
        actor,
        target,
        endsAt,
    };
}
