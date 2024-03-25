import { type ItemType } from 'definitions/items/types'
import { type SceneObject, type SceneStoreState } from './scene'

export enum QuestStatus {
  unavailable,
  available, // on the quest board
  active,
  completed,
  // todo: failed?
}

export type QuestReward = {
  gold?: number
  items?: ItemType[]
}

export type QuestStoreState = {
  name: string
  status: QuestStatus
  party: string[] // list of adventurer ids
  progress: number // Which questnode the party is at currently
  questVars: unknown //
  encounterResults: string[] // Store what option the place chose during an encounter // OBSOLETE
  icon: string

  reward?: QuestReward
  scene?: SceneStoreState
  sceneName?: string
  sceneNamePrev?: string
  objectsPrev: Record<string, SceneObject[]> // previously loaded scene objects
}
