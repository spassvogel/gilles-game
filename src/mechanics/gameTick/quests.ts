import { TextEntry } from "constants/text";
import { getDefinition } from "definitions/quests";
import { QuestDefinition, QuestNodeType } from 'definitions/quests/types';

import { Store } from "redux";
import { StoreState } from "store/types";
import { LogChannel } from "store/types/logEntry";
import { QuestStatus, QuestStoreState } from "store/types/quest";
import { ToastManager } from 'global/ToastManager';
import { TextManager } from 'global/TextManager';
import { Type } from 'components/ui/toasts/Toast';
import { getQuestLink } from 'utils/routing';
import { setSceneName } from 'store/actions/quests';
import { getQuestLeader } from 'store/helpers/storeHelpers';
import { getTimeMultiplier, TimeType } from 'mechanics/time';

export interface QuestUpdate {
    name: string;
    progress: number;
}

export interface LogUpdate extends TextEntry {
    key: string;
    channel: LogChannel;
    channelContext?: string;
}

interface QuestGameTickResponse {
    questUpdates: QuestUpdate[];
    logUpdates: LogUpdate[];
}

const getQuestUpdates = (delta: number, store: Store<StoreState>): QuestGameTickResponse => {

    const speed = 4;    // in nodes per minute
    const timeMultiplier = getTimeMultiplier(TimeType.questProgress);
    const MS_PER_MINUTE = 60000;
    const log: LogUpdate[] = [];
    const quests: QuestUpdate[] = [];
    const state: StoreState = store.getState();
    // Moves the quest line progress. Only if currently at a 'nothing' node
    // Otherwise the player has to do something to move the quest along
    state.quests.forEach((quest: QuestStoreState) => {
        if (quest.status !== QuestStatus.active) {
            return;
        }
        const questDefinition: QuestDefinition = getDefinition(quest.name);
        const currentProgress = quest.progress;
        const currentNodeIndex = Math.floor(currentProgress);
        const currentNode = questDefinition.nodes[currentNodeIndex];
        if (currentNode.type === QuestNodeType.nothing) {
            // Currently at a 'nothing' node
            const progressIncrease = (delta / (MS_PER_MINUTE / timeMultiplier)) * speed;
            // todo: [15/07/2019] speed could be different for each party
            let nextProgress = Math.min(currentProgress + progressIncrease, questDefinition.nodes.length - 1);
            const nodesPassed = Math.floor(nextProgress) - currentNodeIndex;
            for (let i = 1; i <= nodesPassed; i++) {
                // Loop through all the nodes we've passed since last tick
                const nextNode = questDefinition.nodes[currentNodeIndex + i];
                if (nextNode.type === QuestNodeType.encounter) {
                    // We've hit an encounter node. set the progress to here and stop looking at other nodes

                    store.dispatch(setSceneName(quest.name, nextNode.startScene));

                    const questTitle = TextManager.getQuestTitle(quest.name);
                    const leader = getQuestLeader(state.adventurers, quest);
                    ToastManager.addToast(questTitle, Type.questEncounter, leader?.avatarImg, getQuestLink(quest.name));

                    // Add quest to log
                    if (nextNode.log) {
                        log.push({
                            channel: LogChannel.quest,
                            channelContext: quest.name,
                            key: nextNode.log,
                        });
                    }
                    // Dont overshoot the encounter node
                    nextProgress = currentProgress + i;

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
