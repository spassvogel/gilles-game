export interface CombatStoreState {
    actors: Actor[];
    turn: Allegiance;
    action?: CombatAction;
}

export interface Actor {
    name: string;
    allegiance: Allegiance;
    location: number[];
    health: number;
    remainingAP: number;
}

export enum Allegiance {
    player,
    enemy,
}

export interface CombatAction {
    type: CombatActionType;
    actor: string;
    target: number[];
    endsAt: number;
}

export enum CombatActionType {
    move,
    swing,
    shoot,
}

export const barBrawl: CombatStoreState = {
    actors: [{
        name: "john",
        allegiance: Allegiance.player,
        location: [3, 5],
        health: 100,
        remainingAP: 5,
    }, {
        name: "jack",
        allegiance: Allegiance.player,
        location: [4, 5],
        health: 100,
        remainingAP: 4,
    }],
    turn: Allegiance.player,
};