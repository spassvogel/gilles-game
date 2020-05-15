import { QuestStoreState } from 'stores/quest';
import { Item } from 'definitions/items/types';
import { EncounterDefinition } from './encounters';

export enum QuestNodeType {
    nothing = 0,    // Nothing much going on here
    encounter = 1,
    combat = 2,     // Not implemented
    boss = 3,
}

export interface QuestDefinition<TQuestVars = any> {
    nodes: QuestNode<TQuestVars>[];
    requiredItems?: Item[];
    getQuestVars: (questStoreState: QuestStoreState) => TQuestVars;
    getInitialQuestVars: (questStoreState: QuestStoreState) => TQuestVars;
}

export interface QuestNode<TQuestVars = any> {
    x: number;
    y: number;
    type: QuestNodeType;
    encounter?: EncounterDefinition<TQuestVars>; 
    log?: string;      // this text will appear in the log upon entering the node. only at 'nothing' nodes
}