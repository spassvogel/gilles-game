
export interface Actor {
    name: string;
    //allegiance: Allegiance;
    location: [number, number];
    health: number;
    //remainingAP: number;
}

export interface SceneStoreState {
    actors: Actor[];
    actionQueue: SceneAction[];
}

export interface SceneAction {
    actionType: SceneActionType;
    actor: string;
    target: [number, number];
    endsAt: number;
}

export enum SceneActionType {
    move = "move"
}

export const scene1: SceneStoreState = {
    actors: [{
        health: 100,
        location: [3, 5],
        name: "c4a5d270",
    }, {
        health: 100,
        location: [4, 6],
        name: "2e655832",
    }],
    actionQueue: [],
};
