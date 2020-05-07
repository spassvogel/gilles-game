// tslint:disable:object-literal-sort-keys
import { Action } from "redux";
import { CombatActionType } from "stores/combat";

export enum ActionType {
    clearCombatAction = "clearCombatAction",
    startCombatAction = "startCombatAction",
    moveActor = "moveActor",
}

export interface AddCombatActionAction extends Action<ActionType> {
    combatType: CombatActionType;
    actor: string;
    target: [number, number];
    endsAt: number;
}

export interface MoveActorAction extends Action<ActionType> {
    actor: string;
    location: [number, number];
}

export function startCombatAction(type: CombatActionType, actor: string, target: [number, number], endsAt: number): AddCombatActionAction {
    return {
        type: ActionType.startCombatAction,
        combatType: type,
        actor,
        target,
        endsAt,
    };
}

export function moveActor(actor: string, location: [number, number]): MoveActorAction {
    return {
        type: ActionType.moveActor,
        actor,
        location,
    };
}

export function clearCombatAction(): Action<ActionType> {
    // currently there is only one combat possible. so only one needs to be cleared
    return {
        type: ActionType.clearCombatAction,
    };
}
