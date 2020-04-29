import { ActionType as GameActionType, GameTickAction } from "actions/game";
import { ActionType, QuestAction, QuestLaunchAction, QuestVarsAction, StartEncounterAction, UpdateEncounterResultAction, EnqueueSceneActionAction } from "actions/quests";
import { Item } from "definitions/items/types";
import { AnyAction, Reducer } from "redux";
import { QuestStatus, QuestStoreState } from "stores/quest";
import { scene1, SceneActionType } from 'stores/scene';

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
    currentEncounter: null,
    scene: scene1,
}, {
    name: "retrieveMagicAmulet",
    party: [],
    status: QuestStatus.available,
    progress: 0,
    questVars: {},
    encounterResults: [],
    icon: "sigil2.png",
    currentEncounter: null,
    reward: {
        gold: 4,
        items: [ Item.deedForWeaponsmith ],
    },
    scene: scene1,
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

        case ActionType.advanceQuest:
            return advanceQuest(state, action as QuestAction);

        case ActionType.updateQuestVars:
            // Updates the questvars
            return updateQuestVars(state, action as QuestVarsAction);

        case ActionType.updateEncounterResult:
            return updateEncounterResult(state, action as UpdateEncounterResultAction);

        case ActionType.startEncounter:
            return startEncounter(state, action as StartEncounterAction);

        case ActionType.enqueueSceneAction:
            return enqueueSceneAction(state, action as EnqueueSceneActionAction);

            case ActionType.completeSceneAction:
            return completeSceneAction(state, action as QuestAction);

        case GameActionType.gameTick:
           return gameTick(state, action as GameTickAction);

    }
    return state;
};

// Launches quest. Sets state to active, assigns adventurers
const launchQuest = (state: QuestStoreState[], action: QuestLaunchAction) => {
    const party = action.assignedAventurers
        .filter((adventurer) => !!adventurer)
        .map((adventurer) => adventurer.id);

    return state.map((qss) => {
        if (qss.name === action.questName) {
            return {
                ...qss,
                status: QuestStatus.active,
                party,
            };
        }
        return qss;
    });
};

const advanceQuest = (state: QuestStoreState[], action: QuestAction) => {
    // deprecated
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const progress = qss.progress + 1;
            //const questDefinition: QuestDefinition = questDefinitions[qss.name];
            // const nextNode = questDefinition.nodes[Math.floor(progress)];

            return {
                ...qss,
                progress,
            };
        }
        return qss;
    });
};

const startEncounter = (state: QuestStoreState[], action: StartEncounterAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            return {
                ...qss,
                currentEncounter: action.encounter,
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
            const action = scene.actionQueue[0];
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
                ...scene.actionQueue.slice(1)
            ];

            return {
                ...qss,
                scene
            };
        }
        return qss;
    });
};

const gameTick = (state: QuestStoreState[], action: GameTickAction) => {
    const questsToUpdate = action.quests;
    if (!questsToUpdate.length) {
        return state;
    }

    return state.map((qss) => {
        const questToUpdate = questsToUpdate.find((q) => q.name === qss.name);
        if (questToUpdate) {
            const progress = questToUpdate.progress;
            const currentEncounter = questToUpdate.currentEncounter;

            return {
                ...qss,
                progress,
                currentEncounter,
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
