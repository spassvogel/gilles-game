import { Item } from 'definitions/items/types';


export interface SceneStoreState {
    objects: SceneObject[];
    actors: ActorObject[];
    actionQueue?: SceneAction[];
    activeInteractionModal?: SceneInteractionModal;
    combat: boolean;
}

export interface SceneObject {
    id: number;
    name?: string;
    type: string;
    gid?: number;
    location: [number, number];
};

export type ActorObject = {
    id: string;                   // todo: refactor to id
    location: [number, number];     // current location in the scene
    ap: number;                     // Remaining AP
};

 // export type Actor = SceneObject & {
//     type: "actor";
//     //allegiance: Allegiance;
//     health: number;
//     //remainingAP: number;
// }

export type SceneInteractionModal =
| { type: 'lootCache', lootCache: string }
| { type: 'situation', situation: string }

export interface LootCache {
    title: string;
    items: Item[];
    gold?: number;
}

export interface SceneAction {
    actionType: SceneActionType;
    actorId: string;
    target: [number, number];
    endsAt: number;
}

export enum SceneActionType {
    move = "move",
    inspect = "inspect",
    attack = "attack"
    // todo: interact?
    // todo: attack?
}
