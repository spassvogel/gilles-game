import { AdventurerStoreState } from "store/types/adventurer";
import { SceneAction, SceneStoreState, SceneInteractionModal } from "store/types/scene";
import { PartialDeep } from "type-fest";

export type QuestAction = 
    { type: "launchQuest", questName: string, assignedAventurers: AdventurerStoreState[] }
 |  { type: "exitEncounter", questName: string }
 |  { type: "updateQuestVars", questName: string, vars: PartialDeep<unknown> }
 |  { type: "setSceneName", questName: string, sceneName: string }
 |  { type: "setScene", questName: string, scene: SceneStoreState; }
 |  { type: "enqueueSceneAction", questName: string, sceneAction: SceneAction }
 |  { type: "completeSceneAction", questName: string }
 |  { type: "setCombat", questName: string, combat: boolean }
 |  { type: "endPlayerTurn", questName: string }
 |  { type: "deductActorAp", questName: string,  actor: string, ap: number }
 |  { type: "setActorAp", questName: string, actor: string, ap: number }
//  |  { type: "updateEncounterResult", questName: string, nodeIndex: number, result: string }
 |  { type: "setActiveSceneInteractionModal", questName: string, sceneInteractionModal?: SceneInteractionModal }

;


/**
 * Embark upon a new quest */
export const launchQuest = (questName: string, assignedAventurers: AdventurerStoreState[]): QuestAction => ({
    type: "launchQuest",
    questName,
    assignedAventurers,
})

/** 
 * Completes the current encounter so the party can continue the quest */
export const exitEncounter = (quest: string): QuestAction => ({
    type: "exitEncounter",
    questName: quest,
})

export const updateQuestVars = (quest: string, vars: PartialDeep<unknown>): QuestAction => ({
    type: "updateQuestVars",
    questName: quest,
    vars,
})

/**
 * Sets name of the current scene of a quest */
export const setSceneName = (questName: string, sceneName: string): QuestAction =>({
    type: "setSceneName",
    questName,
    sceneName,
})

/**
 * Fills in the scene of a quest */
export const setScene = (questName: string, scene: SceneStoreState): QuestAction => ({
    type: "setScene",
    questName,
    scene,
})

export const enqueueSceneAction = (questName: string, sceneAction: SceneAction): QuestAction => ({
    type: "enqueueSceneAction",
    questName,
    sceneAction,
})

export const completeSceneAction = (questName: string): QuestAction => ({
    type: "completeSceneAction",
    questName,
})

export const setCombat = (questName: string, combat: boolean): QuestAction => ({
    type: "setCombat",
    questName,
    combat
})

export const endPlayerTurn = (questName: string): QuestAction => ({
    type: "endPlayerTurn",
    questName,
})

export const deductActorAp = (questName: string, actor: string, ap: number): QuestAction => ({
    type: "deductActorAp",
    questName,
    actor,
    ap
})

export const setActorAp = (questName: string, actor: string, ap: number): QuestAction => ({
    type: "setActorAp",
    questName,
    actor,
    ap
})


// export const updateEncounterResult = (questName: string, nodeIndex: number, result: string): QuestAction => ({
//     type: "updateEncounterResult",
//     questName,
//     nodeIndex,
//     result,
// })

export const setActiveSceneInteractionModal = (questName: string, sceneInteractionModal?: SceneInteractionModal): QuestAction => ({
    type: "setActiveSceneInteractionModal",
    questName,
    sceneInteractionModal
})

