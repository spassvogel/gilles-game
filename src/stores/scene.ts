

interface Common {
    name: string;
    location: [number, number];
}

export type SceneObject =
 | Common & { type: 'tileobject', gid: number }
 | Common & { type: 'actor', health: number }

 // export type Actor = SceneObject & {
//     type: "actor";
//     //allegiance: Allegiance;
//     health: number;
//     //remainingAP: number;
// }


export interface SceneStoreState {
    objects: SceneObject[];
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
