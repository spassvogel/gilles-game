import { Merge } from 'type-fest';
import { Location } from 'utils/tilemap';
import { TiledObjectData } from 'constants/tiledMapData';
import { Item } from 'definitions/items/types';
import { TiledObjectType } from 'utils/tilemap';
import { ActionIntent } from 'components/world/QuestPanel/QuestDetails/scene/ui/SceneUI';
import { EnemyType } from 'definitions/enemies/types';


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


export type AdventurerObject = SceneObject & {
  id?: number;
  adventurerId: string;
  allegiance: Allegiance.player;
  ap: number;           // Remaining AP
};

export type EnemyObject = SceneObject & {
  enemyType: EnemyType;
  enemyId: string;
  level: number;
  allegiance: Allegiance.enemy;
  ap: number;           // Remaining AP
  health: number;
};

export type ActorObject = AdventurerObject | EnemyObject;

// Type guard for ActorObject
export const isActorObject = (object: SceneObject): object is ActorObject => {
  return object.type === TiledObjectType.actor;
};

// Returns true if given scene Object is an Adventurer (player controlled Actor)
export const isAdventurer = (object: SceneObject): object is AdventurerObject => {
  return isActorObject(object) && object.allegiance === Allegiance.player;
};

// Returns true if given scene Object is an Enemy (AI controlled Actor)
export const isEnemy = (object: SceneObject): object is EnemyObject => {
  return isActorObject(object) && object.allegiance === Allegiance.enemy;
};

// Returns the ActorObject belonging to given adventurerId
export const getAdventurer = (objects: SceneObject[], adventurerId: string): AdventurerObject | undefined => {
  return objects.find(o => isAdventurer(o) && o.adventurerId === adventurerId) as AdventurerObject;
};

export const getUniqueName = (object: SceneObject) => {
  if (isAdventurer(object)) {
    return object.adventurerId;
  }
  if (isEnemy(object)) {
    return object.enemyId;
  }
  return 'UNKNOWN';
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
  actor: string;
  target: Location;
  endsAt: number;
  intent: ActionIntent; // todo: actorId and actionType might not be necessary
}

export enum SceneActionType {
  move = 'move',
  interact = 'interact',
  melee = 'melee',
  shoot = 'shoot',
}

