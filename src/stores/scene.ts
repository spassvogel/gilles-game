


// https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
export type TileObject = {
    id: number;
    name?: string;
    type: string, 
    gid: number 
    location: [number, number];
};

export type ActorObject = {
    name: string;
    location: [number, number];
    health: number 
};

 // export type Actor = SceneObject & {
//     type: "actor";
//     //allegiance: Allegiance;
//     health: number;
//     //remainingAP: number;
// }


export interface SceneStoreState {
    tileObjects: TileObject[];
    actors: ActorObject[];
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
