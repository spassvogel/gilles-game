import { SceneStoreState } from 'stores/scene';
import { StoreState } from 'stores';

export class EncounterDescription {
    getScene(): SceneStoreState {
        throw new Error('not implemented');
    }
}

// export class dungeon extends EncounterDescription {
    
// }

// function getScene<TQuestVars>(store: StoreState, questName: String): SceneStoreState {
//     return {};
// }

// // export function getDefinition<T extends WeaponDefinition>(weapon: string): T {
// //     return weaponDefinitions[weapon] as T;
// // }