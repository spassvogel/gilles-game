import encounters from "../encounters";
import { EncounterDefinition } from "../encounters/types";

// tslint:disable:object-literal-sort-keys

export enum QuestNodeType {
    nothing = 0,    // Nothing much going on here
    encounter = 1,
    combat = 2,
    boss = 3,
}

export interface QuestDefinition {
    displayName: string;
    nodes: QuestNode[];
    // type: StructureType
}

export interface QuestNode {
    x: number;
    y: number;
    type: QuestNodeType;
    encounter?: EncounterDefinition<any>; // todo: or array of encounters
    log?: string;      // this text will appear in the log upon entering the node. only at 'nothing' nodes
}

const kill10boars: QuestDefinition = {
    displayName: "Kill 10 boars",
    nodes: [{
        x: 0,
        y: 1,
        type: QuestNodeType.nothing,
        log: "The party sets out to vanquish 10 terrible pigs",
    }, {
        x: 0,
        y: 3,
        type: QuestNodeType.nothing,
        log: "The party sets out to vanquish 10 terrible pigs",
    }, {
        x: 0,
        y: 3,
        type: QuestNodeType.nothing,
        log: "In the distance, a forest looms",
    }, {
        x: 0,
        y: 2,
        type: QuestNodeType.encounter,
        encounter: encounters.theBigTree,
    }, {
        x: 0,
        y: 3,
        type: QuestNodeType.nothing,
        log: "The party leaves the forest",
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
        encounter: encounters.backstabbed,
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
        encounter: encounters.backstabbed,
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
