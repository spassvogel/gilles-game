import { AnyAction, Reducer } from "redux";
import { ActionType as GameActionType, GameTickAction } from "src/actions/game";
import { ActionType, QuestAction, QuestVarsAction, UpdateEncounterResultAction } from "src/actions/quests";
import questDefinitions, { QuestDefinition, QuestNode, QuestNodeType } from "src/definitions/quests";
import { oracles } from "src/oracle";
import { QuestStoreState } from "src/stores/quest";

// tslint:disable:object-literal-sort-keys
const initialState: QuestStoreState[] = [{
    name: "kill10boars",
    party: [
        "c4a5d270-11e7-11e9-b7ad-4134e879f440",
        "2e655832-65c9-484d-81d7-07938253cf4d",
        "ec6f1050-11e7-11e9-b13b-654a21c6ca63",
        "d299f98a-8f30-4684-b4b5-81baadb388b2",
    ],
    progress: 0,
    questVars: {},
    encounterResults: [],
    log: [],
}, {
    name: "retrieveMagicAmulet",
    party: [
        "96c686c3-2756-4cf7-9301-92f5ab857b8a",
        "250d1a9d-a421-4841-9a89-ee6d6d691339",
        "169384ef-f036-4392-a3ca-8eb8e08e3eb8",
        "f22d66cb-43e0-46ab-93c1-d9ed3800bde0",
    ],
    progress: 0,
    questVars: {},
    encounterResults: [],
    log: [],
}];

/**
 * reducer
 * @param state
 * @param action
 */
export const activeQuests: Reducer<QuestStoreState[]> = (state: QuestStoreState[] = initialState,
                                                         action: AnyAction| GameTickAction) => {
    switch (action.type) {
        case ActionType.advanceQuest:
            return advanceQuest(state, action as QuestAction);

        case ActionType.updateQuestVars:
            // Updates the questvars
            return updateQuestVars(state, action as QuestVarsAction);

        case ActionType.updateEncounterResult:
            return updateEncounterResult(state, action as UpdateEncounterResultAction);

        case GameActionType.gameTick: {
            return advanceQuests(state, action as GameTickAction);
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

const advanceQuests = (state: QuestStoreState[], action: GameTickAction) => {
    // Moves the quest line progress. Only if currently at a 'nothing' node

    const speed = 8;    // nodes per minute
    const MS_PER_MINUTE = 60000;

    return state.map((qss) => {
        const questDefinition: QuestDefinition = questDefinitions[qss.name];
        const currentProgress = qss.progress;

        const currentNode = questDefinition.nodes[Math.floor(currentProgress)];

        if (currentNode.type === QuestNodeType.nothing) {
            // Currently at a 'nothing ' node
            const progressIncrease = ((action.delta / MS_PER_MINUTE) * speed);
            const nextProgress = Math.min(currentProgress + progressIncrease, questDefinition.nodes.length - 1);
            // todo: we can progress more than one node in a frame!!
            let log = qss.log;

            if (Math.floor(nextProgress) > Math.floor(currentProgress)) {
                // we've reached a new node
                const nextNode = questDefinition.nodes[Math.floor(nextProgress)];

                if (nextNode.type === QuestNodeType.encounter) {
                    const encounter = nextNode.encounter!;
                    const oracle = oracles[qss.name];
                    log = [
                        ...log,
                        encounter.getDescription(oracle),
                    ];
                } else if (nextNode.type === QuestNodeType.nothing) {
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
                progress: nextProgress,
                log,
            };
        }
//        console.log(`${qss.progress}  | ${}`);
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
