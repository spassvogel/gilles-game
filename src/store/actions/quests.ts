import { type AdventurerStoreState } from 'store/types/adventurer'
import { type SceneAction, type SceneStoreState, type SceneInteractionModal, type Allegiance } from 'store/types/scene'
import { type PartialDeep } from 'type-fest'
import { type Location } from 'utils/tilemap'

export type QuestAction =
  | { type: 'launchQuest', questName: string, assignedAventurers: AdventurerStoreState[] }
  | { type: 'dismissQuest', questName: string }
  | { type: 'exitEncounter', questName: string }
  | { type: 'updateQuestVars', questName: string, vars: PartialDeep<unknown> }
  | { type: 'setSceneName', questName: string, sceneName: string }
  | { type: 'setScene', questName: string, scene: SceneStoreState }
  | { type: 'enqueueSceneAction', questName: string, sceneAction: SceneAction }
  | { type: 'completeSceneAction', questName: string, actorName: string }
  | { type: 'setCombat', questName: string, combat: boolean }
  | { type: 'endPlayerTurn', questName: string }
  | { type: 'startTurn', questName: string, turn: Allegiance, adventurers?: AdventurerStoreState[] }
  | { type: 'deductActorAp', questName: string, actor: string, ap: number }
  | { type: 'setActorAp', questName: string, actor: string, ap: number }
  | { type: 'setActorLocation', questName: string, actor: string, location: Location }
  | { type: 'modifyEnemyHealth', questName: string, actor: string, health: number }
  //  |  { type: "updateEncounterResult", questName: string, nodeIndex: number, result: string }
  | { type: 'setActiveSceneInteractionModal', questName: string, sceneInteractionModal?: SceneInteractionModal }

/** A Quest has one or more Encounters. The Encounters are the interactive parts where you see the adventurers
 * in a location. Each Encounter has one or more Scenes, the adventurers can move between then.
 */

/**
 * Embark upon a new quest */
export const launchQuest = (questName: string, assignedAventurers: AdventurerStoreState[]): QuestAction => ({
  type: 'launchQuest',
  questName,
  assignedAventurers
})

/**
 * After the quest has failed user can dismiss this quest so it disappears from the quest map */
export const dismissQuest = (questName: string): QuestAction => ({
  type: 'dismissQuest',
  questName
})

/**
 * Completes the current encounter so the party can continue the quest */
export const exitEncounter = (quest: string): QuestAction => ({
  type: 'exitEncounter',
  questName: quest
})

export const updateQuestVars = (quest: string, vars: PartialDeep<unknown>): QuestAction => ({
  type: 'updateQuestVars',
  questName: quest,
  vars
})

/**
 * Sets name of the current scene of a quest */
export const setSceneName = (questName: string, sceneName: string): QuestAction => ({
  type: 'setSceneName',
  questName,
  sceneName
})

/**
 * Fills in the scene of a quest */
export const setScene = (questName: string, scene: SceneStoreState): QuestAction => ({
  type: 'setScene',
  questName,
  scene
})

export const enqueueSceneAction = (questName: string, sceneAction: SceneAction): QuestAction => ({
  type: 'enqueueSceneAction',
  questName,
  sceneAction
})

export const completeSceneAction = (questName: string, actorName: string): QuestAction => ({
  type: 'completeSceneAction',
  questName,
  actorName
})

export const setCombat = (questName: string, combat: boolean): QuestAction => ({
  type: 'setCombat',
  questName,
  combat
})

export const endPlayerTurn = (questName: string): QuestAction => ({
  type: 'endPlayerTurn',
  questName
})

export const startTurn = (questName: string, turn: Allegiance, adventurers?: AdventurerStoreState[]): QuestAction => ({
  type: 'startTurn',
  questName,
  turn,
  adventurers
})

export const deductActorAp = (questName: string, actor: string, ap: number): QuestAction => ({
  type: 'deductActorAp',
  questName,
  actor,
  ap
})

export const modifyEnemyHealth = (questName: string, actor: string, health: number): QuestAction => ({
  type: 'modifyEnemyHealth',
  questName,
  actor,
  health
})

export const setActorAp = (questName: string, actor: string, ap: number): QuestAction => ({
  type: 'setActorAp',
  questName,
  actor,
  ap
})
export const setActorLocation = (questName: string, actor: string, location: Location): QuestAction => ({
  type: 'setActorLocation',
  questName,
  actor,
  location
})

// export const updateEncounterResult = (questName: string, nodeIndex: number, result: string): QuestAction => ({
//   type: "updateEncounterResult",
//   questName,
//   nodeIndex,
//   result,
// })

export const setActiveSceneInteractionModal = (questName: string, sceneInteractionModal?: SceneInteractionModal): QuestAction => ({
  type: 'setActiveSceneInteractionModal',
  questName,
  sceneInteractionModal
})
