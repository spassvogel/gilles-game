import { TiledObjectData } from 'constants/tiledMapData';
import { Item } from 'definitions/items/types';
import { Merge } from 'type-fest';
import { TiledObjectType } from 'utils/tilemap';
import { Allegiance } from './combat';


export interface SceneStoreState {
    objects: SceneObject[];
    actionQueue?: SceneAction[];
    activeInteractionModal?: SceneInteractionModal;
    combat: boolean;
}

export type SceneObject = Merge<TiledObjectData, {
    layerId: number;
    properties: { [key: string]: any};
    location?: [number, number];
}>;

export type ActorObject = SceneObject & {
    ap: number;                     // Remaining AP
    health: number;
    allegiance: Allegiance;
};

export const isActorObject = (object: SceneObject): object is ActorObject => {
    return object.type === TiledObjectType.actor;
}

export const isAdventurer = (object: SceneObject): boolean => {
    return isActorObject(object) && object.allegiance === Allegiance.player;
}

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
    open?: boolean;
}

export interface SceneAction {
    actionType: SceneActionType;
    actorId: string;
    target: [number, number];
    endsAt: number;
}

export enum SceneActionType {
    move = "move",
    interact = "interact",
    attack = "attack",
    slash = "slash"
}

export const getSpritesheetPaths = (objects: SceneObject[]) => {
    return Array.from(
        new Set<string>(
            objects.filter(o => o.properties.isSprite)
                .map(o => o.properties.spritesheet)
        )
    );
}