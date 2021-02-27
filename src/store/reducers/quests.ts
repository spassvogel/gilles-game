import { ActionType as GameActionType, GameTickAction } from "store/actions/game";
import {
    ActionType,
    QuestAction,
    QuestLaunchAction,
    QuestVarsAction,
    UpdateEncounterResultAction,
    EnqueueSceneActionAction,
    SetSceneNameAction,
    SetSceneAction,
    UpdateSceneObjectAction,
    SetActiveSceneInteractionModalAction,
    DeductActorApAction,
    SetCombatAction,
} from "store/actions/quests";
import { AnyAction, Reducer } from "redux";
import { QuestStatus, QuestStoreState } from "store/types/quest";
import { isActorObject, SceneActionType } from 'store/types/scene';
import { QuestDefinition } from 'definitions/quests/types';
import { getDefinition } from 'definitions/quests';
import { initialQuestVars } from 'definitions/quests/kill10Boars/questVars';
import deepmerge from "deepmerge";

// tslint:disable:object-literal-sort-keys
export const initialQuestState: QuestStoreState[] = [{
    name: "kill10Boars",
    status: QuestStatus.active,
    party: [
        "c4a5d270",
        "2e655832",
        "ec6f1050",
        "d299f98a",
    ],
    progress: 0,
    questVars: initialQuestVars,
    encounterResults: [],
    icon: "sigil1.png",
// }, {
//     name: "retrieveMagicAmulet",
//     party: [],
//     status: QuestStatus.available,
//     progress: 0,
//     questVars: {},
//     encounterResults: [],
//     icon: "sigil2.png",
//     reward: {
//         gold: 4,
//         items: [ Item.deedForWeaponsmith ],
//     },
}];

/**
 * reducer
 * @param state
 * @param action
 */
export const quests: Reducer<QuestStoreState[]> = (state: QuestStoreState[] = initialQuestState, action: AnyAction ): QuestStoreState[] => {
    switch (action.type) {
        case ActionType.launchQuest:
            return launchQuest(state, action as QuestLaunchAction);

        case ActionType.exitEncounter:
            return exitEncounter(state, action as QuestAction);

        case ActionType.updateQuestVars:
            // Updates the questvars
            return updateQuestVars(state, action as QuestVarsAction);

        case ActionType.updateEncounterResult:
            return updateEncounterResult(state, action as UpdateEncounterResultAction);

        // case ActionType.startEncounter:
        //     return startEncounter(state, action as StartEncounterAction);

        case ActionType.setSceneName:
            return setSceneName(state, action as SetSceneNameAction);

        case ActionType.setScene:
            return setScene(state, action as SetSceneAction);

        case ActionType.enqueueSceneAction:
            return enqueueSceneAction(state, action as EnqueueSceneActionAction);

        case ActionType.completeSceneAction:
            return completeSceneAction(state, action as QuestAction);

        case ActionType.setCombat:
            return setCombat(state, action as SetCombatAction);

        case ActionType.endPlayerTurn:
            return endPlayerTurn(state, action as QuestAction);

        case ActionType.deductActorAp:
            return deductActorAp(state, action as DeductActorApAction);

        case ActionType.updateSceneObjectAction:
            return updateSceneObjectAction(state, action as UpdateSceneObjectAction);

        case ActionType.setActiveSceneInteractionModal:
            return setActiveSceneInteractionModal(state, action as SetActiveSceneInteractionModalAction);

        case GameActionType.gameTick:
           return gameTick(state, action as GameTickAction);

    }
    return state;
};

// Launches quest. Sets state to active, assigns adventurers
const launchQuest = (questStoreState: QuestStoreState[], action: QuestLaunchAction) => {
    const party = action.assignedAventurers
        .filter((adventurer) => !!adventurer)
        .map((adventurer) => adventurer.id);

    return questStoreState.map((qss) => {
        if (qss.name === action.questName) {
            const questDefinition: QuestDefinition = getDefinition(action.questName);
            const questVars = questDefinition.getInitialQuestVars(qss);

            return {
                ...qss,
                status: QuestStatus.active,
                party,
                questVars
            };
        }
        return qss;
    });
};

const exitEncounter = (state: QuestStoreState[], action: QuestAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const progress = qss.progress + 1;
            // const questDefinition: QuestDefinition = questDefinitions[qss.name];
            // const nextNode = questDefinition.nodes[Math.floor(progress)];

            return {
                ...qss,
                progress,
                scene: undefined,
                sceneName: undefined
            };
        }
        return qss;
    });
};

// const startEncounter = (state: QuestStoreState[], action: StartEncounterAction) => {
//     const {scene} = action;
//     return state.map((qss) => {
//         if (qss.name === action.questName) {
//             return {
//                 ...qss,
//                 scene
//             };
//         }
//         return qss;
//     });
// };

// To change scene, set scene name. The scenecontroller will load the scene data and art assets
// and call setScene reducer
const setSceneName = (state: QuestStoreState[], action: SetSceneNameAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            return {
                ...qss,
                sceneName: action.sceneName,
                scene: undefined
            };
        }
        return qss;
    });
};

const setScene = (state: QuestStoreState[], action: SetSceneAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            return {
                ...qss,
                scene: action.scene
            };
        }
        return qss;
    });
};

// Enqueues a scene action on this quest
const enqueueSceneAction = (state: QuestStoreState[], action: EnqueueSceneActionAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const scene = qss.scene;
            if (!scene) throw new Error("Something broke. No scene");
            scene.actionQueue = [...scene.actionQueue || [], action.sceneAction];

            return {
                ...qss,
                scene
            };
        }
        return qss;
    });
};

// next action on scene is completed
const completeSceneAction = (state: QuestStoreState[], action: QuestAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const scene = qss.scene;
            if (!scene) throw new Error("Something broke. No scene");
            const sceneAction = scene.actionQueue![0];
            if (!sceneAction) return qss;

            switch (sceneAction.actionType) {
                case SceneActionType.move: {
                    scene.objects = scene.objects.map((a) => {
                        if (isActorObject(a) && a.name === sceneAction.actorId) {
                            return {
                                ...a,
                                location: sceneAction.target
                            };
                        }
                        return a;
                    })
                }
            }

            // pop first action of the stack
            scene.actionQueue = [
                ...scene.actionQueue!.slice(1)
            ];

            return {
                ...qss,
                scene
            };
        }
        return qss;
    });
};


const setCombat = (state: QuestStoreState[], action: SetCombatAction) => {
    const {combat} = action;
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const scene = { ...qss.scene!, combat };
            return {
                ...qss,
                scene
            };
        }
        return qss;
    });
};

const endPlayerTurn = (state: QuestStoreState[], action: QuestAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const scene = qss.scene;
            if (!scene) throw new Error("Something broke. No scene");

            scene.objects = scene.objects.map(o => {
                if (isActorObject(o)) {
                    const ap = 0;
                    return {
                        ...o,
                        ap
                    };
                }
                return o;
            })

            return {
                ...qss,
                scene
            };
        }
        return qss;
    });
}

const deductActorAp = (state: QuestStoreState[], action: DeductActorApAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const scene = qss.scene;
            if (!scene) throw new Error("Something broke. No scene");

            scene.objects = scene.objects.map(o => {
                if (isActorObject(o) && o.name === action.actor) {
                    const ap = o.ap - action.ap;
                    return {
                        ...o,
                        ap
                    };
                }
                return o;
            })

            return {
                ...qss,
                scene
            };
        }
        return qss;
    });
}

const updateSceneObjectAction = (state: QuestStoreState[], action: UpdateSceneObjectAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const scene = qss.scene;
            if (!scene) throw new Error("Something broke. No scene");

            scene.objects = scene.objects.map(tO => {
                if (tO.id === action.id) {
                    return {
                        ...tO,
                        ...action.object
                    }
                }
                return tO;
            })

            return {
                ...qss,
                scene
            };
        }
        return qss;
    });
}


const gameTick = (state: QuestStoreState[], action: GameTickAction) => {
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
};

const updateQuestVars = (state: QuestStoreState[], action: QuestVarsAction)  => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            return {
                ...qss,
                // todo: sort this out
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                questVars: deepmerge(qss.questVars, action.vars, { arrayMerge: overwriteMerge })
            };
        }
        return qss;
    });
};

const updateEncounterResult = (state: QuestStoreState[], action: UpdateEncounterResultAction)  => {
    return state.map((qss: QuestStoreState) => {
        if (qss.name === action.questName) {
            const encounterResults = qss.encounterResults.concat();
            encounterResults[action.nodeIndex] = action.result;
            return {
                ...qss,
                encounterResults,
            };
        }
        return qss;
    });
};

const setActiveSceneInteractionModal = (state: QuestStoreState[], action: SetActiveSceneInteractionModalAction) => {
    return state.map((qss: QuestStoreState) => {
        if (qss.name === action.questName && qss.scene) {
            qss.scene.activeInteractionModal = action.sceneInteractionModal
        }
        return qss;
    });
}

// const takeGoldFromCache = (state: QuestStoreState[], action: TakeGoldFromCacheAction) => {
//     return state.map((qss: QuestStoreState) => {
//         if (qss.name === action.questName && qss.scene) {
//             const lootCaches = {
//                 ...qss.scene?.caches,
//                 [action.cacheName]: {
//                     ...qss.scene?.caches[action.cacheName],
//                     gold: 0
//                 }
//             }
//             qss.scene.caches = lootCaches;
//         }
//         return qss;
//     });
// }

// const takeItemFromCache = (state: QuestStoreState[], action: TakeItemFromCacheAction) => {
//     return state.map((qss: QuestStoreState) => {
//         if (qss.name === action.questName && qss.scene) {
//             const cache = qss.scene.caches[action.cacheName];
//             const index = cache.items.indexOf(action.item);
//             if (index > -1 ) {
//                 qss.scene.caches[action.cacheName].items = [
//                     ...cache.items.slice(0, index),
//                     ...cache.items.slice(index + 1)
//                 ]
//             }
//         }
//         return qss;
//     });
// }

// // Call this when the quest has progressed a node. Will return either `log` or a new array
// // with all values of `log` and a new value appended
// const addLogMessage = (log: string[],
//                        currentNode: QuestNode, nextNode: QuestNode, quest: QuestStoreState): string[] => {
//     if (currentNode.type === QuestNodeType.nothing && nextNode.type === QuestNodeType.nothing) {
//         // Moved from a 'nothing' node to a 'nothing' node
//         // There is no need to flood the log with unimportant messages
//         return log;
//     }
//     switch (nextNode.type) {
//         case QuestNodeType.nothing:
//             return [
//                 ...log,
//                 "The party trrrudges on",
//             ];
//         case QuestNodeType.encounter:
//             const encounter = nextNode.encounter!;
//             console.log(encounter.getDescription(oracle))
//             //return log;
//             return [
//                 ...log,
//                 encounter.getDescription(oracle),
//             ]
//         default:
//             return log;
//     }
// }

const overwriteMerge = (destinationArray: any[], sourceArray: any[]) => sourceArray