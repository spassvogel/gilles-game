import { SceneStoreState } from 'stores/scene';
import { StoreState } from 'stores';
import { EncounterDefinition } from 'definitions/quests/encounters';
import { Kill10BoarsQuestVars } from '..';


const dungeon: EncounterDefinition<Kill10BoarsQuestVars> = {
    getScene(store: StoreState, questName: String): SceneStoreState {
        throw new Error('not implemented');
    }
}
export default dungeon;

// export class EncounterDescription {
//     getScene(): SceneStoreState {
//         throw new Error('not implemented');
//     }
// }

// export class dungeon extends EncounterDescription {
    
// }

// function getScene<TQuestVars>(store: StoreState, questName: String): SceneStoreState {
//     return {};
// }

// // export function getDefinition<T extends WeaponDefinition>(weapon: string): T {
// //     return weaponDefinitions[weapon] as T;
// // }