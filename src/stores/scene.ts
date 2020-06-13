
export interface Actor {
    name: string;
    //allegiance: Allegiance;
    location: [number, number];
    health: number;
    //remainingAP: number;
}

export interface SceneStoreState {
    actors: Actor[];    // todo: objects in addition to actors (or instead)
    actionQueue?: SceneAction[];
}

export interface SceneAction {
    actionType: SceneActionType;
    actor: string;
    target: [number, number];
    endsAt: number;
}

export enum SceneActionType {
    move = "move"
    // todo: interact?
}

// export const scene1: SceneStoreState = {
//     tilemap: "scenes/ork-dungeon-level1.json",
//     actors: [{
//         health: 100,
//         location: [3, 5],
//         name: "c4a5d270",
//     }, {
//         health: 100,
//         location: [4, 6],
//         name: "2e655832",
//     }],
// };
