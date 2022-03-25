import { Reducer } from 'redux';
import { QuestStatus, QuestStoreState } from 'store/types/quest';
import { Allegiance, getUniqueName, isActorObject, isAdventurer, isEnemy, SceneActionType } from 'store/types/scene';
import { QuestDefinition } from 'definitions/quests/types';
import { getDefinition } from 'definitions/quests';
import { initialQuestVars } from 'definitions/quests/kill10Boars/questVars';
import deepmerge from 'deepmerge';
import { Action } from 'store/actions';
import { calculateInitialAP, ENEMY_BASE_AP } from 'mechanics/combat';
import { xpToLevel } from 'mechanics/adventurers/levels';

const overwriteMerge = (_: [], sourceArray: []) => sourceArray;

export const initialQuestState: QuestStoreState[] = [{
  name: 'kill10Boars',
  status: QuestStatus.active,
  party: [
    'c4a5d270',
    '2e655832',
    'ec6f1050',
    'd299f98a',
  ],
  progress: 0,
  questVars: initialQuestVars,
  encounterResults: [],
  icon: 'sigil1.png',
// }, {
//   name: "retrieveMagicAmulet",
//   party: [],
//   status: QuestStatus.available,
//   progress: 0,
//   questVars: {},
//   encounterResults: [],
//   icon: "sigil2.png",
//   reward: {
//     gold: 4,
//     items: [ Item.deedForWeaponsmith ],
//   },
}];

/**
 * reducer
 * @param state
 * @param action
 */
// eslint-disable-next-line @typescript-eslint/default-param-last
export const quests: Reducer<QuestStoreState[]> = (state: QuestStoreState[] = initialQuestState, action: Action): QuestStoreState[] => {
  switch (action.type) {
    // Launches quest. Sets state to active, assigns adventurers
    case 'launchQuest': {
      const party = action.assignedAventurers
        .filter((adventurer) => !!adventurer)
        .map((adventurer) => adventurer.id);

      return state.map((qss) => {
        if (qss.name === action.questName) {
          const questDefinition: QuestDefinition = getDefinition(action.questName);
          const questVars = questDefinition.getInitialQuestVars(qss);

          return {
            ...qss,
            status: QuestStatus.active,
            party,
            questVars,
          };
        }
        return qss;
      });
    }

    case 'exitEncounter': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const progress = qss.progress + 1;
          // const questDefinition: QuestDefinition = questDefinitions[qss.name];
          // const nextNode = questDefinition.nodes[Math.floor(progress)];

          return {
            ...qss,
            progress,
            scene: undefined,
            sceneName: undefined,
          };
        }
        return qss;
      });
    }

    // Updates the questvars
    case 'updateQuestVars': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          return {
            ...qss,
            questVars: deepmerge(qss.questVars as Partial<unknown>, action.vars as Partial<unknown>, { arrayMerge: overwriteMerge }),
          };
        }
        return qss;
      });
    }

    // case "updateEncounterResult":
    //   return updateEncounterResult(state, action as UpdateEncounterResultAction);

    // case "startEncounter":
    //   return startEncounter(state, action as StartEncounterAction);

    // To change scene, set scene name. The scenecontroller will load the scene data and art assets
    // and call setScene reducer
    case 'setSceneName': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          return {
            ...qss,
            sceneName: action.sceneName,
            sceneNamePrev: qss.sceneName,
            scene: undefined,
          };
        }
        return qss;
      });
    }

    case 'setScene': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          return {
            ...qss,
            scene: action.scene,
          };
        }
        return qss;
      });
    }

    // Enqueues a scene action on this quest
    case 'enqueueSceneAction': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene;
          if (!scene) throw new Error('Something broke. No scene');
          scene.actionQueue = [
            ...scene.actionQueue ?? [],
            action.sceneAction,
          ];

          return {
            ...qss,
            scene,
          };
        }
        return qss;
      });
    }

    // next action on scene is completed
    case 'completeSceneAction': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene;
          if (!scene || !scene.actionQueue) throw new Error('Something broke. No scene');
          const sceneAction = scene.actionQueue[0];
          if (!sceneAction) return qss;

          switch (sceneAction.intent.action) {
            case SceneActionType.move: {
              scene.objects = scene.objects.map((a) => {
                if (getUniqueName(a) === action.actorName) {
                  console.log('the new location is ', sceneAction.intent.to, sceneAction.intent.actor);
                  return {
                    ...a,
                    location: sceneAction.intent.to,
                  };
                }
                return a;
              });
            }
          }

          // pop first action of the stack
          // scene.actionQueue = scene.actionQueue.filter((_, i) => i > 0);
          const index = scene.actionQueue.findIndex(aQ => (getUniqueName(aQ.intent.actor) === action.actorName));
          scene.actionQueue = scene.actionQueue.filter((_, i) => i !== index);

          return {
            ...qss,
            scene,
          };
        }
        return qss;
      });
    }

    case 'setCombat': {
      const { combat } = action;
      return state.map((qss) => {
        if (qss.name === action.questName && qss.scene) {
          const scene = {
            ...qss.scene,
            combat,
            turn: combat ? Allegiance.player : undefined,
          };
          return {
            ...qss,
            scene,
          };
        }
        return qss;
      });
    }

    case 'endPlayerTurn': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene;
          if (!scene) throw new Error('Something broke. No scene');

          scene.objects = scene.objects.map(o => {
            if (isActorObject(o)) {
              const ap = 0;
              return {
                ...o,
                ap,
              };
            }
            return o;
          });

          return {
            ...qss,
            scene,
          };
        }
        return qss;
      });
    }

    case 'startTurn': {
      // Starts a combat turn, either for Player or Enemy
      return state.map((qss) => {
        if (qss.name === action.questName) {
          if (!qss.scene) throw new Error('Something broke. No scene');
          const { turn } = action;
          const scene = qss.scene;

          if (turn === Allegiance.player) {
            scene.objects = scene.objects.map(o => {
              if (isAdventurer(o)) {
                const adventurerInStore = action.adventurers?.find(a => a.id === o.name);
                if (adventurerInStore){
                  const level = xpToLevel(adventurerInStore.xp);
                  const ap = calculateInitialAP(adventurerInStore.basicAttributes, level);
                  return {
                    ...o,
                    ap,
                  };
                }
                return o;
              }
              return o;
            });
          } else if (turn === Allegiance.enemy) {
            scene.objects = scene.objects.map(o => {
              if (isEnemy(o)) {
                const ap = ENEMY_BASE_AP;
                return {
                  ...o,
                  ap,
                };
              }
              return o;
            });
          }

          return {
            ...qss,
            scene: {
              ...scene,
              turn,
            },
          };
        }
        return qss;
      });
    }

    case 'setActorAp': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene;
          if (!scene) throw new Error('Something broke. No scene');

          scene.objects = scene.objects.map(o => {
            if (isActorObject(o) && o.name === action.actor) {
              const ap = action.ap;
              return {
                ...o,
                ap,
              };
            }
            return o;
          });

          return {
            ...qss,
            scene,
          };
        }
        return qss;
      });
    }

    case 'deductActorAp': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene;
          if (!scene) throw new Error('Something broke. No scene');

          scene.objects = scene.objects.map(o => {
            if (isAdventurer(o) && o.adventurerId === action.actor || isEnemy(o) && o.enemyId === action.actor) {
              const ap = o.ap - action.ap;
              return {
                ...o,
                ap,
              };
            }
            return o;
          });

          return {
            ...qss,
            scene,
          };
        }
        return qss;
      });
    }

    case 'modifyEnemyHealth': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene;
          if (!scene) throw new Error('Something broke. No scene');
          const objects = scene.objects.map(o => {
            if (isActorObject(o) && o.name === action.actor) {
              // todo
              // const health = o.health + action.health;
              const health = 23;
              return {
                ...o,
                health,
              };
            }
            return o;
          });

          return {
            ...qss,
            scene: {
              ...scene,
              objects,
            },
          };
        }
        return qss;
      });
    }

    // case "updateSceneObjectAction": {
    //   return state.map((qss) => {
    //     if (qss.name === action.questName) {
    //       const scene = qss.scene;
    //       if (!scene) throw new Error("Something broke. No scene");

    //       scene.objects = scene.objects.map(tO => {
    //         if (tO.id === action.id) {
    //           return {
    //             ...tO,
    //             ...action.object
    //           }
    //         }
    //         return tO;
    //       })

    //       return {
    //         ...qss,
    //         scene
    //       };
    //     }
    //     return qss;
    //   });
    // }

    case 'setActorLocation': {
      return state.map((qss) => {
        if (qss.name === action.questName) {
          const scene = qss.scene;
          if (!scene) throw new Error('Something broke. No scene');

          scene.objects = scene.objects.map(o => {
            if (getUniqueName(o) === action.actor) {
              const location = action.location;
              return {
                ...o,
                location,
              };
            }
            return o;
          });

          return {
            ...qss,
            scene,
          };
        }
        return qss;
      });
    }

    case 'setActiveSceneInteractionModal': {
      return state.map((qss: QuestStoreState) => {
        if (qss.name === action.questName && qss.scene) {
          qss.scene.activeInteractionModal = action.sceneInteractionModal;
        }
        return qss;
      });
    }

    case 'gameTick': {
      const questsToUpdate = action.quests;
      if (!questsToUpdate.length) {
        return state;
      }

      return state.map((qss) => {
        const questToUpdate = questsToUpdate.find((q) => q.name === qss.name);
        if (questToUpdate) {
          const progress = questToUpdate.progress;
          // const currentEncounter = questToUpdate.currentEncounter;

          return {
            ...qss,
            progress,
            // currentEncounter,
          };
        }
        return qss;
      });
    }
  }
  return state;
};


