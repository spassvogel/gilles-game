import { Reducer } from "redux";
import { QuestStatus, QuestStoreState } from "store/types/quest";
import { isActorObject, SceneActionType } from 'store/types/scene';
import { QuestDefinition } from 'definitions/quests/types';
import { getDefinition } from 'definitions/quests';
import { initialQuestVars } from 'definitions/quests/kill10Boars/questVars';
import deepmerge from "deepmerge";
import { Action } from "store/actions";
import { Allegiance } from "store/types/combat";

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
export const quests: Reducer<QuestStoreState[]> = (state: QuestStoreState[] = initialQuestState, action: Action): QuestStoreState[] => {
    switch (action.type) {
        // Launches quest. Sets state to active, assigns adventurers
        case "launchQuest": {
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
                        questVars
                    };
                }
                return qss;
            });
        }

        case "exitEncounter": {
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
        }

        // Updates the questvars
        case "updateQuestVars": {
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
        }

        // case "updateEncounterResult":
        //     return updateEncounterResult(state, action as UpdateEncounterResultAction);

        // case "startEncounter":
        //     return startEncounter(state, action as StartEncounterAction);

        // To change scene, set scene name. The scenecontroller will load the scene data and art assets
        // and call setScene reducer
        case "setSceneName": {
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
        }

        case "setScene": {
            return state.map((qss) => {
                if (qss.name === action.questName) {
                    return {
                        ...qss,
                        scene: action.scene
                    };
                }
                return qss;
            });
        }

        // Enqueues a scene action on this quest
        case "enqueueSceneAction": {
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
        }

        // next action on scene is completed
        case "completeSceneAction": {
            return state.map((qss) => {
                if (qss.name === action.questName) {
                    const scene = qss.scene;
                    if (!scene || !scene.actionQueue) throw new Error("Something broke. No scene");
                    const sceneAction = scene.actionQueue[0];
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
                        ...scene.actionQueue.slice(1)
                    ];

                    return {
                        ...qss,
                        scene
                    };
                }
                return qss;
            });
        }

        case "setCombat": {
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
                        scene
                    };
                }
                return qss;
            });
        }

        case "endPlayerTurn": {
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

        case "startTurn": {
            return state.map((qss) => {
                if (qss.name === action.questName) {
                    // const scene = qss.scene;
                    if (!qss.scene) throw new Error("Something broke. No scene");
                    const { turn } = action;
                    return {
                        ...qss,
                        scene: {
                            ...qss.scene,
                            turn
                        }
                    };
                }
                return qss;
            });
        }

        case "setActorAp": {
            return state.map((qss) => {
                if (qss.name === action.questName) {
                    const scene = qss.scene;
                    if (!scene) throw new Error("Something broke. No scene");
        
                    scene.objects = scene.objects.map(o => {
                        if (isActorObject(o) && o.name === action.actor) {
                            const ap = action.ap;
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

        case "deductActorAp": {
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

        // case "updateSceneObjectAction": {
        //     return state.map((qss) => {
        //         if (qss.name === action.questName) {
        //             const scene = qss.scene;
        //             if (!scene) throw new Error("Something broke. No scene");
        
        //             scene.objects = scene.objects.map(tO => {
        //                 if (tO.id === action.id) {
        //                     return {
        //                         ...tO,
        //                         ...action.object
        //                     }
        //                 }
        //                 return tO;
        //             })
        
        //             return {
        //                 ...qss,
        //                 scene
        //             };
        //         }
        //         return qss;
        //     });
        // }

        case "setActiveSceneInteractionModal": {
            return state.map((qss: QuestStoreState) => {
                if (qss.name === action.questName && qss.scene) {
                    qss.scene.activeInteractionModal = action.sceneInteractionModal
                }
                return qss;
            });
        }

        case "gameTick": {
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

const overwriteMerge = (_: [], sourceArray: []) => sourceArray

