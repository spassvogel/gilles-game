import { QuestStoreState } from 'stores/quest';
import { QuestDefinition, QuestNodeType } from '../types';

export interface Kill10BoarsQuestVars {
    foo: boolean;
    bar: number;
}

const kill10Boars: QuestDefinition<Kill10BoarsQuestVars> = {
    getQuestVars: (questStore: QuestStoreState) => questStore.questVars as Kill10BoarsQuestVars,
    getInitialQuestVars: (questStore: QuestStoreState) => {
        const vars: Kill10BoarsQuestVars = {
            foo: false,
            bar: 3
        }
        return vars;
    },
    nodes: [{
        x: 0,
        y: 1,
        type: QuestNodeType.nothing,
        log: "quest-kill10Boars-node0",
    // }, {
    //     x: 0,
    //     y: 2,
    //     type: QuestNodeType.nothing,
    //     log: "quest-kill10Boars-node1",
    }, {
        x: 0,
        y: 3,
        type: QuestNodeType.encounter,
        startScene: "dungeon.entrance"
    }, {
        x: 1,
        y: 3,
        type: QuestNodeType.nothing,
        log: "quest-kill10Boars-node4",
    }, {
        x: 1,
        y: 3,
        type: QuestNodeType.nothing,
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