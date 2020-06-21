import { ActionType as GameActionType, GameTickAction } from "actions/game";
import { ActionType, QuestAction, QuestLaunchAction, QuestVarsAction, UpdateEncounterResultAction, EnqueueSceneActionAction, SetSceneNameAction, SetSceneAction, UpdateSceneObjectAction, TakeGoldFromCacheAction } from "actions/quests";
import { Item } from "definitions/items/types";
import { AnyAction, Reducer } from "redux";
import { QuestStatus, QuestStoreState } from "stores/quest";
import { SceneActionType } from 'stores/scene';
import { QuestDefinition } from 'definitions/quests/types';
import { getDefinition } from 'definitions/quests';

// tslint:disable:object-literal-sort-keys
const initialState: QuestStoreState[] = [{
    name: "kill10Boars",
    status: QuestStatus.active,
    party: [
        "c4a5d270",
        "2e655832",
        "ec6f1050",
        "d299f98a",
    ],
    progress: 0,
    questVars: {},
    encounterResults: [],
    icon: "sigil1.png",
}, {
    name: "retrieveMagicAmulet",
    party: [],
    status: QuestStatus.available,
    progress: 0,
    questVars: {},
    encounterResults: [],
    icon: "sigil2.png",
    reward: {
        gold: 4,
        items: [ Item.deedForWeaponsmith ],
    },
}];

/**
 * reducer
 * @param state
 * @param action
 */
export const quests: Reducer<QuestStoreState[]> = (state: QuestStoreState[] = initialState, action: AnyAction ) => {
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

        case ActionType.updateSceneObjectAction:
            return updateSceneObjectAction(state, action as UpdateSceneObjectAction);

        case ActionType.takeGoldFromCache:
            return takeGoldFromCache(state, action as TakeGoldFromCacheAction);

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
            //const questDefinition: QuestDefinition = questDefinitions[qss.name];
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
const setSceneName = (state: QuestStoreState[], action: SetSceneNameAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            return {
                ...qss,
                sceneName: action.sceneName
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

// Action on scene is completed
const completeSceneAction = (state: QuestStoreState[], action: QuestAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const scene = qss.scene;
            if (!scene) throw new Error("Something broke. No scene");
            const action = scene.actionQueue![0];
            if (!action) return qss;

            switch (action.actionType) {
                case SceneActionType.move: {
                    scene.actors = scene.actors.map((a) => {
                        if (a.name === action.actor) {
                            return { ...a, location: action.target };
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

const updateSceneObjectAction = (state: QuestStoreState[], action: UpdateSceneObjectAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const scene = qss.scene;
            if (!scene) throw new Error("Something broke. No scene");

            scene.tileObjects = scene.tileObjects.map(tO => {
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
            //const currentEncounter = questToUpdate.currentEncounter;

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
            const questVars = Object.assign({}, qss.questVars, action.vars);
            return {
                ...qss,
                questVars,
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

const takeGoldFromCache = (state: QuestStoreState[], action: TakeGoldFromCacheAction) => {
    return state.map((qss: QuestStoreState) => {
        if (qss.name === action.questName && qss.scene) {            
            const lootCaches = {
                ...qss.scene?.caches,
                [action.cacheName]: {
                    ...qss.scene?.caches[action.cacheName],
                    gold: 0
                }
            }
            qss.scene.caches = lootCaches;
        }
        return qss;
    });
}

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
//             const oracle = oracles[quest.name];
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
