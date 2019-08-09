export interface CombatStoreState {
    actors: Actor[],
    turn: Allegiance,
    action: Action,
}

export interface Actor {
    name: string,
    allegiance: Allegiance,
    location: number[],
    health: number,
    remainingAP: number
}

export enum Allegiance {
    player,
    enemy
}

export interface Action {
    type: ActionType,
    actor: string,
    target: number[],
    endsAt: number
}

export enum ActionType {
    move,
    swing,
    shoot
}