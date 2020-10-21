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
    name: string;                   // todo: refactor to id
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
    actor: string;
    target: [number, number];
    endsAt: number;
}

export enum SceneActionType {
    move = "move"
    // todo: interact?
    // todo: attack?
}
