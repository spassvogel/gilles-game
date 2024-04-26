import { type Reducer } from 'redux'
import { QuestStatus, type QuestStoreState } from 'store/types/quest'
import {
  Allegiance,
  getUniqueName,
  isActorObject,
  isAdventurer,
  isEnemy,
  type SceneObject
} from 'store/types/scene'
import { type QuestDefinition } from 'definitions/quests/types'
import { getDefinition } from 'definitions/quests'
import { initialQuestVars } from 'definitions/quests/kill10Boars/questVars'
import deepmerge from 'deepmerge'
import { calculateInitialAP, ENEMY_BASE_AP } from 'mechanics/combat'
import { xpToLevel } from 'mechanics/adventurers/levels'
import { type GameTickActionExt } from 'store/middleware/gameTick'
import { type QuestAction } from 'store/actions/quests'
import { isMovingIntent } from 'components/world/QuestPanel/QuestDetails/scene/ui/SceneUI'

const overwriteMerge = (_: [], sourceArray: []) => sourceArray

export const initialQuestState: QuestStoreState[] = [{
  name: 'kill10Boars',
  status: QuestStatus.active,
  party: [
    'adv_c4a5d270',
    'adv_2e655832',
    'adv_ec6f1050',
    'adv_d299f98a'
  ],
  progress: 0,
  questVars: initialQuestVars,
  encounterResults: [],
  icon: 'sigil1.png',
  objectsPrev: {}
}, {
  name: 'retrieveMagicAmulet',
  party: [],
  status: QuestStatus.available,
  progress: 0,
  questVars: {},
  encounterResults: [],
  icon: 'sigil2.png',
  reward: {
    gold: 4,
    items: []
  },
  objectsPrev: {}
}]

/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const quests: Reducer<QuestStoreState[], QuestAction | GameTickActionExt> = (state: QuestStoreState[] = initialQuestState, action): QuestStoreState[] => {
  switch (action.type) {
    // Launches quest. Sets state to active, assigns adventurers
    case 'launchQuest': {
      const party = action.assignedAventurers
        .filter((adventurer) => adventurer !== undefined)
        .map((adventurer) => adventurer.id)

      return state.map((qss) => {
        if (qss.name === action.questName) {
          const questDefinition: QuestDefinition = getDefinition(action.questName)
          const questVars = questDefinition.getInitialQuestVars(qss)

          return {
            ...qss,
            status: QuestStatus.active,
            party,
            questVars
          }
        }
        return qss
      })
    }

    // After the quest has failed user can dismiss this quest so it disappears from the quest map
    case 'dismissQuest': {
      return state.filter(q => q.name !== action.questName)
    }

    case 'exitEncounter': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const progress = qss.progress + 1
          // const questDefinition: QuestDefinition = questDefinitions[qss.name]
          // const nextNode = questDefinition.nodes[Math.floor(progress)]

          return {
            ...qss,
            progress,
            scene: undefined,
            sceneName: undefined
          }
        }
        return qss
      })
    }

    // Updates the questvars
    case 'updateQuestVars': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          return {
            ...qss,
            questVars: deepmerge(qss.questVars as Partial<unknown>, action.vars as Partial<unknown>, { arrayMerge: overwriteMerge })
          }
        }
        return qss
      })
    }

    // case "updateEncounterResult":
    //   return updateEncounterResult(state, action as UpdateEncounterResultAction)

    // case "startEncounter":
    //   return startEncounter(state, action as StartEncounterAction)

    // To change scene, set scene name. Store the current objects in `objectsPrev`
    // The scenecontroller will load the scene data and art assets and call setScene reducer
    case 'setSceneName': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          let { objectsPrev } = qss

          if (qss.sceneName != null) {
            // Store the non-adventurer objects such that we can put them back into place when player returns to this scene
            const nonAdventurerObjects = (qss.scene?.objects ?? []).filter((sO) => !isAdventurer(sO))
            objectsPrev = {
              ...qss.objectsPrev,
              [qss.sceneName]: nonAdventurerObjects
            }
          }

          return {
            ...qss,
            sceneName: action.sceneName,
            sceneNamePrev: qss.sceneName,
            objectsPrev,
            scene: undefined
          }
        }
        return qss
      })
    }

    case 'setScene': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          return {
            ...qss,
            scene: action.scene
          }
        }
        return qss
      })
    }

    // Enqueues a scene action on this quest
    case 'enqueueSceneAction': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene
          if (scene == null) throw new Error('Something broke. No scene')
          const actionQueue = [
            ...scene.actionQueue ?? [],
            action.sceneAction
          ]

          return {
            ...qss,
            scene: {
              ...scene,
              actionQueue
            }
          }
        }
        return qss
      })
    }

    // next action on scene is completed
    case 'completeSceneAction': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene
          let objects = scene?.objects ?? []
          if ((scene?.actionQueue == null)) return qss
          const sceneAction = scene.actionQueue.find(aq => getUniqueName(aq.intent.actor) === action.actorName)
          if (sceneAction == null) return qss

          const intent = sceneAction.intent
          if (isMovingIntent(intent)) {
            objects = scene.objects.map((a) => {
              if (getUniqueName(a) === action.actorName && ((intent.path?.[intent.path.length - 1]) != null)) {
                return {
                  ...a,
                  location: intent.path[intent.path.length - 1]
                }
              }
              return a
            })
          }

          const index = scene.actionQueue.findIndex(aQ => (getUniqueName(aQ.intent.actor) === action.actorName))
          const actionQueue = scene.actionQueue.filter((_, i) => i !== index)

          return {
            ...qss,
            scene: {
              ...scene,
              actionQueue,
              objects
            }
          }
        }
        return qss
      })
    }

    case 'setCombat': {
      const { combat } = action
      return state.map((qss) => {
        if (qss.name === action.questName && (qss.scene != null)) {
          const scene = {
            ...qss.scene,
            combat,
            turn: combat ? Allegiance.player : undefined
          }
          return {
            ...qss,
            scene
          }
        }
        return qss
      })
    }

    case 'endPlayerTurn': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene
          if (scene == null) throw new Error('Something broke. No scene')

          const objects = scene.objects.map(o => {
            if (isActorObject(o)) {
              const ap = 0
              return {
                ...o,
                ap
              }
            }
            return o
          })

          return {
            ...qss,
            scene: {
              ...scene,
              objects
            }
          }
        }
        return qss
      })
    }

    case 'startTurn': {
      // Starts a combat turn, either for Player or Enemy
      return state.map((qss) => {
        if (qss.name === action.questName) {
          if (qss.scene == null) throw new Error('Something broke. No scene')
          const { turn } = action
          const scene = qss.scene
          let objects: SceneObject[] = []

          if (turn === Allegiance.player) {
            objects = scene.objects.map(o => {
              if (isAdventurer(o)) {
                const adventurerInStore = action.adventurers?.find(a => a.id === getUniqueName(o))
                if (adventurerInStore != null) {
                  const level = xpToLevel(adventurerInStore.xp)
                  const ap = adventurerInStore.health > 0 ? calculateInitialAP(adventurerInStore.basicAttributes, level) : 0
                  return {
                    ...o,
                    ap
                  }
                }
                return o
              }
              return o
            })
          } else if (turn === Allegiance.enemy) {
            objects = scene.objects.map(o => {
              if (isEnemy(o)) {
                const ap = o.health > 0 ? ENEMY_BASE_AP : 0
                return {
                  ...o,
                  ap
                }
              }
              return o
            })
          }

          return {
            ...qss,
            scene: {
              ...scene,
              objects,
              turn
            }
          }
        }
        return qss
      })
    }

    case 'setActorAp': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene
          if (scene == null) throw new Error('Something broke. No scene')

          const objects = scene.objects.map(o => {
            if (getUniqueName(o) === action.actor && isActorObject(o)) {
              const ap = action.ap
              return {
                ...o,
                ap
              }
            }
            return o
          })

          return {
            ...qss,
            scene: {
              ...scene,
              objects
            }
          }
        }
        return qss
      })
    }

    case 'deductActorAp': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene
          if (scene == null) throw new Error('Something broke. No scene')

          const objects = scene.objects.map(o => {
            if ((isAdventurer(o) && o.adventurerId === action.actor) || (isEnemy(o) && o.enemyId === action.actor)) {
              const ap = o.ap - action.ap
              return {
                ...o,
                ap
              }
            }
            return o
          })

          return {
            ...qss,
            scene: {
              ...scene,
              objects
            }
          }
        }
        return qss
      })
    }

    case 'modifyEnemyHealth': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene
          if (scene == null) throw new Error('Something broke. No scene')
          const objects = scene.objects.map(o => {
            if (isEnemy(o) && o.enemyId === action.actor) {
              const health = o.health + action.health
              return {
                ...o,
                health
              }
            }
            return o
          })

          return {
            ...qss,
            scene: {
              ...scene,
              objects
            }
          }
        }
        return qss
      })
    }

    // case "updateSceneObjectAction": {
    //   return state.map((qss) => {
    //     if (qss.name === action.questName) {
    //       const scene = qss.scene
    //       if (!scene) throw new Error("Something broke. No scene")

    //       scene.objects = scene.objects.map(tO => {
    //         if (tO.id === action.id) {
    //           return {
    //             ...tO,
    //             ...action.object
    //           }
    //         }
    //         return tO
    //       })

    //       return {
    //         ...qss,
    //         scene
    //       }
    //     }
    //     return qss
    //   })
    // }

    case 'setActorLocation': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene
          if (scene == null) throw new Error('Something broke. No scene')

          const objects = scene.objects.map(o => {
            if (getUniqueName(o) === action.actor) {
              const location = action.location
              return {
                ...o,
                location
              }
            }
            return o
          })

          return {
            ...qss,
            scene: {
              ...scene,
              objects
            }
          }
        }
        return qss
      })
    }

    case 'setActiveSceneInteractionModal': {
      return state.map((qss: QuestStoreState) => {
        if (qss.name === action.questName && (qss.scene != null)) {
          return {
            ...qss,
            scene: {
              ...qss.scene,
              activeInteractionModal: action.sceneInteractionModal
            }
          }
        }
        return qss
      })
    }

    case 'gameTick': {
      const questsToUpdate = action.quests
      if (questsToUpdate.length === 0) {
        return state
      }

      return state.map((qss) => {
        const questToUpdate = questsToUpdate.find((q) => q.name === qss.name)
        if (questToUpdate != null) {
          const progress = questToUpdate.progress
          // const currentEncounter = questToUpdate.currentEncounter

          return {
            ...qss,
            progress
            // currentEncounter,
          }
        }
        return qss
      })
    }
  }
  return state
}
