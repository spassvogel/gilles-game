import { SceneStoreState } from 'stores/scene';
import { StoreState } from 'stores';

export interface EncounterDefinition<TQuestVars> {
    getScene<TQuestVars> (store: StoreState, questName: String): SceneStoreState

    // getOracle: (questName: string, store: StoreState) => Oracle;
    // chance?: number;    // number from 0 to 1, undefined means: 1
    // getDescription: (oracle: Oracle) => TextEntry;
    // getOptions: (oracle: Oracle) => Record<string, string>;
    // answer: (option: string, oracle: Oracle, dispatch: Dispatch<AnyAction>) => string;
}