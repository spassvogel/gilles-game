import { AnyAction, Reducer } from "redux";
import { ActionType as GameActionType, GameTickAction } from "src/actions/game";
import { ActionType, QuestAction, QuestVarsAction, StartEncounterAction, UpdateEncounterResultAction } from "src/actions/quests";
import encounterDefintions from "src/definitions/encounters";
import questDefinitions, { QuestDefinition, QuestNodeType } from "src/definitions/quests";
import { oracles } from "src/oracle";
import { QuestStoreState, QuestStatus } from "src/stores/quest";

// tslint:disable:object-literal-sort-keys
const initialState: QuestStoreState[] = [{
    name: "kill10boars",
    status: QuestStatus.available,
    party: "3tf8h79boh6",
    progress: 0,
    questVars: {},
    encounterResults: [],
    log: [],
    icon: "sigil1.png",
    currentEncounter: null,
}, {
    name: "retrieveMagicAmulet",
    party: "rx2nv4rqwn",
    status: QuestStatus.available,
    progress: 0,
    questVars: {},
    encounterResults: [],
    log: [],
    icon: "sigil2.png",
    currentEncounter: null,
}];

/**
 * reducer
 * @param state
 * @param action
 */
export const quests: Reducer<QuestStoreState[]> = (state: QuestStoreState[] = initialState,
                                                         action: AnyAction| GameTickAction) => {
    switch (action.type) {
        case ActionType.advanceQuest:
            return advanceQuest(state, action as QuestAction);

        case ActionType.updateQuestVars:
            // Updates the questvars
            return updateQuestVars(state, action as QuestVarsAction);

        case ActionType.updateEncounterResult:
            return updateEncounterResult(state, action as UpdateEncounterResultAction);

        case ActionType.startEncounter:
            return startEncounter(state, action as StartEncounterAction);
            // return updateEncounterResult(state, action as UpdateEncounterResultAction);

        case GameActionType.gameTick: {
            return gameTick(state, action as GameTickAction);
        }
    }
    return state;
};

const advanceQuest = (state: QuestStoreState[], action: QuestAction) => {
    return state.map((qss) => {
        if (qss.name === action.questName) {
            const progress = qss.progress + 1;
            const questDefinition: QuestDefinition = questDefinitions[qss.name];
            const nextNode = questDefinition.nodes[Math.floor(progress)];
            let log = qss.log;

            if (nextNode.type === QuestNodeType.nothing) {
                if (nextNode.log) {
                    log = [
                        ...log,
                        nextNode.log,
                    ];
                }
            }

            return {
                ...qss,
                progress,
                log,
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
    }); };

const gameTick = (state: QuestStoreState[], action: GameTickAction) => {
    // Moves the quest line progress. Only if currently at a 'nothing' node
    // Otherwise the user has to do something to move the quest along

    const speed = 100;    // in nodes per minute
    const MS_PER_MINUTE = 60000;

    return state.map((qss) => {
        const questDefinition: QuestDefinition = questDefinitions[qss.name];
        const currentProgress = qss.progress;

        const currentNode = questDefinition.nodes[Math.floor(currentProgress)];

        if (currentNode.type === QuestNodeType.nothing) {
            // Currently at a 'nothing' node
            const progressIncrease = (action.delta / MS_PER_MINUTE) * speed;
            const currentNodeIndex =  Math.floor(currentProgress);
            let nextProgress = Math.min(currentProgress + progressIncrease, questDefinition.nodes.length - 1);
            const hops = Math.floor(nextProgress) - currentNodeIndex;

            let log = qss.log;
            let currentEncounter = qss.currentEncounter;

            for (let i = 0; i < hops; i++) {
                // Loop through all the nodes we've passed since last tick
                const nextNode = questDefinition.nodes[currentNodeIndex + i];
                if (nextNode.type === QuestNodeType.encounter) {
                    // We've hit an encounter node. set the progress to here and stop looking at other nodes
                    const encounter = encounterDefintions[nextNode.encounter!];
                    const oracle = oracles[qss.name];
                    nextProgress = currentNodeIndex + i;
                    log = [
                        ...log,
                        encounter.getDescription(oracle),
                    ];
                    currentEncounter = nextNode.encounter!;
                    // Start encounter(encounter)
                    // TODO: How to dispatch an action from a reducer?
                    // OR: move this logic outside of reducer
                    break;
                } else if (nextNode.type === QuestNodeType.nothing) {
                    currentEncounter = null;
                    if (nextNode.log) {
                        log = [
                            ...log,
                            nextNode.log,
                        ];
                    }
                }
            }

            return {
                ...qss,
                currentEncounter,
                progress: nextProgress,
                log,
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
