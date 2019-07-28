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
        y: 3,
        type: QuestNodeType.nothing,
        log: "quest-kill10Boars-node1",
    // }, {
    //     x: 0,
    //     y: 3,
    //     type: QuestNodeType.nothing,
    //     log: "In the distance, a forest looms",
    }, {
        x: 0,
        y: 2,
        type: QuestNodeType.encounter,
        encounter: Encounter.goblinHouseOutside,
    }, {
        x: 0,
        y: 3,
        type: QuestNodeType.nothing,
        log: "quest-kill10Boars-node4",
    }, {
        x: 1,
        y: 3,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 3,
        type: QuestNodeType.nothing,
    }, {
        x: 2,
        y: 1,
        type: QuestNodeType.encounter,
        encounter: Encounter.backstabbed,
    }, {
        x: 1,
        y: 3,
        type: QuestNodeType.nothing,
        log: "The party spots a boss",
    }, {
        x: 2,
        y: 3,
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
        log: "Papa loves mambo",
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
        log: "Mama loves mambo",
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
        log: "Look at 'em sway with it",
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
        log: "gettin' so gay with it",
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 1,
        y: 1,
        type: QuestNodeType.nothing,
    }, {
        x: 0,
        y: 2,
        type: QuestNodeType.encounter,
        encounter: Encounter.theBigTree,
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

const all = {
    kill10Boars,
    retrieveMagicAmulet,
};

export default all;

export function getDefinition(quest: string): QuestDefinition {
    return all[quest];
}
