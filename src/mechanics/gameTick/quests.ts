import { TextEntry } from "constants/text";
import questDefinitions from "definitions/quests";
import { QuestDefinition, QuestNodeType } from 'definitions/quests/types';

import { Store } from "redux";
import { StoreState } from "stores";
import { LogChannel } from "stores/logEntry";
import { QuestStatus, QuestStoreState } from "stores/quest";
import { ToastManager } from 'global/ToastManager';
import { TextManager } from 'global/TextManager';
import { Type } from 'components/ui/toasts/Toast';
import { getQuestLeader } from 'storeHelpers';
import { getQuestLink } from 'utils/routing';
import dungeon from 'definitions/quests/kill10Boars/encounters/dungeon';
import { loadResource } from 'utils/pixiJs';
import { TiledMapData } from 'constants/tiledMapData';
import { startEncounter } from 'actions/quests';

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

const getQuestUpdates = (delta: number, store: Store<StoreState>): QuestGameTickResponse => {
    // Moves the quest line progress. Only if currently at a 'nothing' node
    // Otherwise the user has to do something to move the quest along

    const speed = 4;    // in nodes per minute
    const MS_PER_MINUTE = 60000;
    const log: LogUpdate[] = [];
    const quests: QuestUpdate[] = [];
    const state: StoreState = store.getState();

    state.quests.forEach((quest: QuestStoreState) => {
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
                    
                    // Start encounter(encounter)
                    //const encounter = encounterDefintions[nextNode.encounter!];
                    const encounter = dungeon;
                    loadResource(`${process.env.PUBLIC_URL}/${encounter.tilemap}`, (resource) => {
                        const mapData: TiledMapData = resource.data;
                        const scene = dungeon.createScene(state, mapData, quest.name, quest.questVars);
                        store.dispatch(startEncounter(quest.name, scene));
                    })

                    const questTitle = TextManager.getQuestTitle(quest.name);
                    const leader = getQuestLeader(state.adventurers, quest);
                    ToastManager.addToast(questTitle, Type.questEncounter, leader?.avatarImg, getQuestLink(quest.name));

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
