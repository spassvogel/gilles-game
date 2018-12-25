import { Oracle } from "src/oracle";
import { StoreState } from "src/stores";

export interface EncounterDefinition<TQuestVars> {
    getOracle: (questName: string, store: StoreState) => Oracle<TQuestVars>;
    chance?: number;    // number from 0 to 1, undefined means: 1
    getTitle: (oracle: Oracle<TQuestVars>) => string;
    getDescription: (oracle: Oracle<TQuestVars>) => string;
    getOptions: (oracle: Oracle<TQuestVars>) => Record<string, string>;
    answer: (option: string, oracle: Oracle<TQuestVars>) => string;
}
