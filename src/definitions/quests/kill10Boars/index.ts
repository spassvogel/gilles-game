import { QuestStoreState } from 'store/types/quest';
import { QuestDefinition, QuestNodeType } from '../types';
import { initialQuestVars, Kill10BoarsQuestVars } from './questVars';


const kill10Boars: QuestDefinition<Kill10BoarsQuestVars> = {
    getQuestVars: (questStore: QuestStoreState) => questStore.questVars as Kill10BoarsQuestVars,
    getInitialQuestVars: (questStore: QuestStoreState) => {
        return initialQuestVars;
    },
    nodes: [{
        x: 0,
        y: 1,
        type: QuestNodeType.nothing,
        log: "quest-kill10-boars-node0",
    }, {
    //     x: 0,
    //     y: 2,
    //     type: QuestNodeType.nothing,
    // }, {
    //     x: 0,
    //     y: 3,
    //     type: QuestNodeType.nothing,
    // }, {
    //     x: 0,
    //     y: 4,
    //     type: QuestNodeType.nothing,
    // }, {
        x: 0,
        y: 3,
        type: QuestNodeType.encounter,
        // log: "quest-kill10-boars-enter-dungeon",
        startScene: "dungeon.entrance"
    }, {
        x: 1,
        y: 3,
        type: QuestNodeType.nothing,
        log: "quest-kill10-boars-leave-dungeon",
    }, {
        x: 1,
        y: 3,
        type: QuestNodeType.nothing,
        log: "quest-kill10-boars-left-dungeon"
    }, {
        x: 2,
        y: 3,
        type: QuestNodeType.nothing,
    }, {
        x: 3,
        y: 3,
        type: QuestNodeType.encounter,
        startScene: "dungeon.hallway"

        //encounter: Encounter.backstabbed,
    }, {
        x: 4,
        y: 4,
        type: QuestNodeType.nothing,
        log: "The party spots a boss",
    }, {
        x: 5,
        y: 4,
        type: QuestNodeType.nothing,
    }],
};

export default kill10Boars;