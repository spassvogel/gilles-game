import { EncounterDefinition } from 'definitions/quests/encounters';
import { RetrieveMagicAmuletQuestVars } from '..';

const theBigTree: EncounterDefinition<RetrieveMagicAmuletQuestVars> = {
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
export default theBigTree;