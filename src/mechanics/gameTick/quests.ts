import { TextEntry } from "constants/text";
import questDefinitions from "definitions/quests";
import { QuestDefinition, QuestNodeType } from 'definitions/quests/types';

import { oracles } from "oracle";
import { StoreState } from "stores";
import { LogChannel } from "stores/logEntry";
import { QuestStatus, QuestStoreState } from "stores/quest";
import { ToastManager } from 'global/ToastManager';
import { TextManager } from 'global/TextManager';
import { Type } from 'components/ui/toasts/Toast';
import { getQuestLeader } from 'storeHelpers';

export interface QuestUpdate {
    name: string;
    progress: number;
}

export interface LogUpdate extends TextEntry {
    key: string;
    channel: LogChannel;
    channelContext?: any;
}

interface QuestGameTickResponse {
    questUpdates: QuestUpdate[];
    logUpdates: LogUpdate[];
}

const getQuestUpdates = (delta: number, store: StoreState): QuestGameTickResponse => {
    // Moves the quest line progress. Only if currently at a 'nothing' node
    // Otherwise the user has to do something to move the quest along

    const speed = 4;    // in nodes per minute
    const MS_PER_MINUTE = 60000;
    const log: LogUpdate[] = [];
    const quests: QuestUpdate[] = [];

    store.quests.forEach((quest: QuestStoreState) => {
        if (quest.status !== QuestStatus.active) {
            return;
        }
        const questDefinition: QuestDefinition = questDefinitions[quest.name];
        const currentProgress = quest.progress;
        const currentNodeIndex =  Math.floor(currentProgress);
        const currentNode = questDefinition.nodes[currentNodeIndex];

        if (currentNode.type === QuestNodeType.nothing) {
            // Currently at a 'nothing' node
            const progressIncrease = (delta / MS_PER_MINUTE) * speed;
            // todo: [15/07/2019] speed could be different for each party
            let nextProgress = Math.min(currentProgress + progressIncrease, questDefinition.nodes.length - 1);
            const nodesPassed = Math.floor(nextProgress) - currentNodeIndex;

            //let currentEncounter = quest.currentEncounter;

            for (let i = 1; i <= nodesPassed; i++) {
                // Loop through all the nodes we've passed since last tick
                const nextNode = questDefinition.nodes[currentNodeIndex + i];
                if (nextNode.type === QuestNodeType.encounter) {
                    // We've hit an encounter node. set the progress to here and stop looking at other nodes
                    // const encounter = encounterDefintions[nextNode.encounter!];
                    // const oracle = oracles[quest.name];
                    // nextProgress = currentNodeIndex + i;
                    // currentEncounter = nextNode.encounter!;

                    // todo !! START ENCOUNTER - PREPARE SCENE !!
                    // add to QuestGameTickResponse

                    // Start encounter(encounter)
                    const questTitle = TextManager.getQuestTitle(quest.name);
                    const leader = getQuestLeader(store.adventurers, quest);
                    ToastManager.addToast(questTitle, Type.questEncounter, leader?.avatarImg);

                    // Add quest to log
                    // log.push({
                    //     channel: LogChannel.quest,
                    //     channelContext: quest.name,
                    //     // ...encounter.getDescription(oracle),
                    // });

                    break;
                } else if (nextNode.type === QuestNodeType.nothing) {
                    if (nextNode.log) {
                        log.push({
                            channel: LogChannel.quest,
                            channelContext: quest.name,
                            key: nextNode.log,
                        });
                    }
                }
            }
            quests.push({
                name: quest.name,
                progress: nextProgress,
            });
        }
    });

    return {
        logUpdates: log,
        questUpdates: quests,
    };
};

export default getQuestUpdates;
