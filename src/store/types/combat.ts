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
    target: [number, number];
    endsAt: number;
}

export enum CombatActionType {
    move = "move",
    slash = "slash",
    shoot = "shoot",
}

export const barBrawl: CombatStoreState = {
    actors: [{
        allegiance: Allegiance.player,
        health: 100,
        location: [3, 5],
        name: "c4a5d270",
        remainingAP: 5,
    }, {
        allegiance: Allegiance.player,
        health: 100,
        location: [4, 6],
        name: "2e655832",
        remainingAP: 4,
    }],
    turn: Allegiance.player,
};
