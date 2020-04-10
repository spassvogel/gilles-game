import { Item } from "definitions/items/types";
import { Encounter } from "../encounters/types";

// tslint:disable:object-literal-sort-keys

export enum QuestNodeType {
    nothing = 0,    // Nothing much going on here
    encounter = 1,
    combat = 2,     // Not implemented
    boss = 3,
}

export interface QuestDefinition {
    nodes: QuestNode[];
    requiredItems?: Item[];
}

export interface QuestNode {
    x: number;
    y: number;
    type: QuestNodeType;
    encounter?: Encounter; // TODO: or array of encounters
    log?: string;      // this text will appear in the log upon entering the node. only at 'nothing' nodes
}

const kill10Boars: QuestDefinition = {
    nodes: [{
        x: 0,
        y: 1,
        type: QuestNodeType.nothing,
        log: "quest-kill10Boars-node0",
    }, {
        x: 0,
        y: 2,
        type: QuestNodeType.nothing,
        log: "quest-kill10Boars-node1",
    // }, {
    //     x: 0,
    //     y: 3,
    //     type: QuestNodeType.nothing,
    //     log: "In the distance, a forest looms",
    }, {
        x: 0,
        y: 3,
        type: QuestNodeType.encounter,
        encounter: Encounter.goblinHouseOutside,
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
        encounter: Encounter.backstabbed,
    }, {
        x: 4,
        y: 4,
        type: QuestNodeType.nothing,
        log: "The party spots a boss",
    }, {
        x: 5,
        y: 4,
        type: QuestNodeType.boss,
    }],
};

const retrieveMagicAmulet: QuestDefinition = {
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
        encounter: Encounter.theBigTree,
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
        encounter: Encounter.backstabbed,
    }, {
        x: 3,
        y: 1,
        type: QuestNodeType.boss,
    }],
};

// const fulruhmRaid: QuestDefinition = {
//     nodes: [{
//         x: -4,
//         y: -1,
//         type: QuestNodeType.nothing,
//     }, {
//         x: -4,
//         y: -1,
//         type: QuestNodeType.nothing,

const all = {
    kill10Boars,
    retrieveMagicAmulet,
};

export default all;

export function getDefinition(quest: string): QuestDefinition {
    return all[quest];
}
