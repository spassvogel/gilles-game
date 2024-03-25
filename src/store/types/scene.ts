import { type Merge } from 'type-fest'
import { type Location, TiledObjectType } from 'utils/tilemap'
import { type TiledObjectData } from 'constants/tiledMapData'
import { type Item } from 'definitions/items/types'
import { type ActionIntent } from 'components/world/QuestPanel/QuestDetails/scene/ui/SceneUI'
import { type EnemyType } from 'definitions/enemies/types'

export type SceneStoreState = {
  objects: SceneObject[]
  actionQueue?: SceneAction[]
  activeInteractionModal?: SceneInteractionModal
  combat: boolean
  turn?: Allegiance
}

export enum Allegiance {
  player,
  enemy,
}

// todo: strip of unneeded stuff
// ### 2024-03-25 Strip down objects
export type SceneObject = Omit<Merge<TiledObjectData, {
  layerId: number
  properties: Record<string, string | boolean | number>
  location?: Location
}>, 'x' | 'y' | 'width' | 'height'>

export type AdventurerObject = SceneObject & {
  id?: number
  adventurerId: string
  allegiance: Allegiance.player
  ap: number // Remaining AP
}

export type EnemyObject = SceneObject & {
  enemyType: EnemyType
  enemyId: string
  level: number
  allegiance: Allegiance.enemy
  ap: number // Remaining AP
  health: number
}

export type ActorObject = AdventurerObject | EnemyObject

// Type guard for ActorObject
export const isActorObject = (object: SceneObject): object is ActorObject => {
  return object.type === TiledObjectType.actor
}

// Returns true if given scene Object is an Adventurer (player controlled Actor)
export const isAdventurer = (object: SceneObject): object is AdventurerObject => {
  return isActorObject(object) && object.allegiance === Allegiance.player
}

// Returns true if given scene Object is an Enemy (AI controlled Actor)
export const isEnemy = (object: SceneObject): object is EnemyObject => {
  return isActorObject(object) && object.allegiance === Allegiance.enemy
}

// Returns the ActorObject belonging to given adventurerId
export const getAdventurer = (objects: SceneObject[], adventurerId: string): AdventurerObject | undefined => {
  return objects.find(o => isAdventurer(o) && o.adventurerId === adventurerId) as AdventurerObject
}

export const getUniqueName = (object: SceneObject) => {
  if (isAdventurer(object)) {
    return object.adventurerId
  }
  if (isEnemy(object)) {
    return object.enemyId
  }
  return 'UNKNOWN'
}

export type SceneInteractionModal =
| { type: 'lootCache', lootCache: string }
| { type: 'situation', situation: string }

export type LootCache = {
  title: string
  items: Item[]
  gold?: number
  open?: boolean
}

export type SceneAction = {
  intent: ActionIntent
  endsAt: number
  delay?: number
}

export enum SceneActionType {
  move = 'move',
  interact = 'interact',
  melee = 'melee',
  shoot = 'shoot',
  consume = 'consume'
}
