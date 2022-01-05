import { Merge } from 'type-fest';
import { Location } from 'utils/tilemap';
import { TiledObjectData } from 'constants/tiledMapData';
import { Item } from 'definitions/items/types';
import { TiledObjectType } from 'utils/tilemap';


export interface SceneStoreState {
  objects: SceneObject[];
  actionQueue?: SceneAction[];
  activeInteractionModal?: SceneInteractionModal;
  combat: boolean;
  turn?: Allegiance;
}

export enum Allegiance {
  player,
  enemy,
}

export type SceneObject = Merge<TiledObjectData, {
  layerId: number;
  properties: { [key: string]: string | boolean | number };
  location?: Location;
}>;

export type ActorObject = SceneObject & {
  id: string;              // override
  name: string;
  ap: number;           // Remaining AP
  level?: number;         // Only for enemy, for adventurers we look at the adventurers store
  health: number;
  allegiance: Allegiance;
};

// Type guard for ActorObject
export const isActorObject = (object: SceneObject): object is ActorObject => {
  return object.type === TiledObjectType.actor;
};

// Returns true if given scene Object is an Adventurer (player controlled Actor)
export const isAdventurer = (object: SceneObject): object is ActorObject => {
  return isActorObject(object) && object.allegiance === Allegiance.player;
};

// Returns true if given scene Object is an Enemy (AI controlled Actor)
export const isEnemy = (object: SceneObject): object is ActorObject => {
  return isActorObject(object) && object.allegiance === Allegiance.enemy;
};

// Returns the ActorObject belonging to given adventurerId
export const getAdventurer = (objects: SceneObject[], adventurerId: string): ActorObject | undefined => {
  return objects.find(o => isAdventurer(o) && o.name === adventurerId) as ActorObject;
};

// export type Actor = SceneObject & {
//   type: "actor";
//   //allegiance: Allegiance;
//   health: number;
//   //remainingAP: number;
// }

export type SceneInteractionModal =
| { type: 'lootCache', lootCache: string }
| { type: 'situation', situation: string };

export interface LootCache {
  title: string;
  items: Item[];
  gold?: number;
  open?: boolean;
}

export interface SceneAction {
  actionType: SceneActionType;
  actorId: string;
  target: Location;
  endsAt: number;
}

export enum SceneActionType {
  move = 'move',
  interact = 'interact',
  melee = 'melee',
  shoot = 'shoot',
}

