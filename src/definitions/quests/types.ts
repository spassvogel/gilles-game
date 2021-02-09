import { QuestStoreState } from 'store/types/quest';
import { Item } from 'definitions/items/types';
import { QuestVars } from './questVars';

export enum QuestNodeType {
    nothing = 0,    // Nothing much going on here
    encounter = 1,
    // combat = 2,     // Not implemented
    // boss = 3,
}

// eslint-disable-next-line @typescript-eslint/ban-types
export interface QuestDefinition<TQuestVars = QuestVars> {
    nodes: QuestNode[];
    requiredItems?: Item[];
    getQuestVars: (questStoreState: QuestStoreState) => TQuestVars;
    getInitialQuestVars: (questStoreState: QuestStoreState) => TQuestVars;
}

type AllNodeTypes = {
    x: number;
    y: number;
    log?: string;   
}

export type QuestNode  =
    | AllNodeTypes & { type: QuestNodeType.nothing}
    | AllNodeTypes & { type: QuestNodeType.encounter, startScene: string}
