// tslint:disable:object-literal-sort-keys

export enum QuestNodeType {
    nothing = 0,    // Nothing much going on here
    encounter = 1,
    combat = 2,
    boss = 3,
}

interface QuestDefinition {
    displayName: string;
    nodes: QuestNode[];
    // type: StructureType
}

interface QuestNode {
    x: number;
    y: number;
    type: QuestNodeType;
    encounter?: any;
}

const kill10boars: QuestDefinition = {
    displayName: "Kill 10 boars",
    nodes: [{
        x: 0,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 0,
        y: 2,
        type: QuestNodeType.encounter,
    }, {
        x: 0,
        y: 3,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 3,
        type: QuestNodeType.nothing,
    }, {
        x: 2,
        y: 3,
        type: QuestNodeType.boss,
    }],
};

const retrieveMagicAmulet: QuestDefinition = {
    displayName: "Retrieve the magic amulet",
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
        type: QuestNodeType.encounter,
    }, {
        x: 3,
        y: 1,
        type: QuestNodeType.boss,
    }],
};

export default {
    kill10boars,
    retrieveMagicAmulet,
};
