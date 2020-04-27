
export interface Actor {
    name: string;
    //allegiance: Allegiance;
    location: number[];
    health: number;
    //remainingAP: number;
}

export interface SceneStoreState {
    actors: Actor[];
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
};
