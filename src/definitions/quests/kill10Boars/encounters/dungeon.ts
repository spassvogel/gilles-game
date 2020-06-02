import { SceneStoreState } from 'stores/scene';
import { StoreState } from 'stores';
import { EncounterDefinition } from 'definitions/quests/encounters';
import { Kill10BoarsQuestVars } from '..';
import { TiledMapData } from 'constants/tiledMapData';


const dungeon: EncounterDefinition<Kill10BoarsQuestVars> = {
    tilemap: "scenes/ork-dungeon-level1.json",

    createScene(store, tilemapData, questName, questVars) {
        return {
            tilemap: this.tilemap,
            actors: [{
                health: 100,
                location: [0, 0],
                name: "c4a5d270",
            }, {
                health: 100,
                location: [4, 6],
                name: "2e655832",
            }]
        }
        // throw new Error('not implemented');
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