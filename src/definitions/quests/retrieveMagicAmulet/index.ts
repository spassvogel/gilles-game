import { QuestStoreState } from 'stores/quest';
import { Item } from 'definitions/items/types';
import { QuestDefinition, QuestNodeType } from '../types';

export interface RetrieveMagicAmuletQuestVars {
    baz: boolean;
    zux: number;
}

const retrieveMagicAmulet: QuestDefinition<RetrieveMagicAmuletQuestVars> = {
    getQuestVars: (questStore: QuestStoreState) => questStore.questVars as RetrieveMagicAmuletQuestVars,
    getInitialQuestVars: (questStore: QuestStoreState) => {
        const vars: RetrieveMagicAmuletQuestVars = {
            baz: false,
            zux: 13
        }
        return vars;
    },
    requiredItems: [
        Item.torch,
        Item.torch,
        Item.torch,
        Item.sandwich,
        Item.sandwich,
    ],
    nodes: [{
        x: 0,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 2,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 3,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 4,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 5,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 7,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 8,
        y: 2,
        type: QuestNodeType.nothing,
    }, {
        x: 8,
        y: 3,
        type: QuestNodeType.nothing,
    }, {
        x: 9,
        y: 3,
        type: QuestNodeType.nothing,
    }, {
        x: 10,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 10,
        y: 2,
        type: QuestNodeType.nothing,
    }, {
        x: 10,
        y: 3,
        type: QuestNodeType.nothing,
    }, {
        x: 10,
        y: 4,
        type: QuestNodeType.nothing,
    }, {
        x: 11,
        y: 5,
        type: QuestNodeType.nothing,
    }, {
        x: 12,
        y: 6,
        type: QuestNodeType.nothing,
    }, {
        x: 12,
        y: 7,
        type: QuestNodeType.nothing,
    }, {
        x: 13,
        y: 8,
        type: QuestNodeType.nothing,
    }, {
        x: 12,
        y: 8,
        type: QuestNodeType.nothing,
    }, {
        x: 12,
        y: 9,
        type: QuestNodeType.nothing,
    }, {
        x: 11,
        y: 8,
        type: QuestNodeType.nothing,
    }, {
        x: 10,
        y: 8,
        type: QuestNodeType.nothing,
    }, {
        x: 9,
        y: 8,
        type: QuestNodeType.nothing,
    }, {
        x: 8,
        y: 9,
        type: QuestNodeType.nothing,
    }, {
        x: 7,
        y: 8,
        type: QuestNodeType.encounter,
        startScene: "dungeon.hallway"
    }, {
        x: 8,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 2,
        y: 1,
        type: QuestNodeType.encounter,
        startScene: "dungeon.hallway"
    }, {
        x: 3,
        y: 1,
        type: QuestNodeType.nothing,
    }],
};

export default retrieveMagicAmulet;