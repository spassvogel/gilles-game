import { Item } from 'definitions/items/types';


export interface SceneStoreState {
    tileObjects: TileObject[];
    actors: ActorObject[];
    caches: { [key: string]: LootCache }
    actionQueue?: SceneAction[];
    activeLootCache?: string; // todo: could be other interaction things besides lootcache?
}

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
export interface TileObject {
    id: number;
    name?: string;
    type: string;
    gid: number;
    location: [number, number];
};

export type ActorObject = {
    name: string;                   // todo: refactor to id
    location: [number, number];
    health: number;
};

 // export type Actor = SceneObject & {
//     type: "actor";
//     //allegiance: Allegiance;
//     health: number;
//     //remainingAP: number;
// }


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
}
