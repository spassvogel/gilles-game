import { EncounterDefinition, createActors } from 'definitions/quests/encounters';
import { Kill10BoarsQuestVars } from '..';
import { getExtendedTilemapObjects } from 'utils/tilemap';
import { adventurersOnQuest } from 'storeHelpers';


const dungeon: EncounterDefinition<Kill10BoarsQuestVars> = {
    tilemap: "scenes/ork-dungeon-level2.json",

    createScene(store, tilemapData, questName) {
        const tilemapObjects = getExtendedTilemapObjects(tilemapData);
        const quest = store.quests.find(q => q.name === questName)!;
        const adventurers = adventurersOnQuest(store.adventurers, quest);
        const actors = createActors(tilemapObjects, adventurers);

        // todo: perhaps this should be a class such that stuff that repeats for every scene can be done in a base class
        return {
            tilemap: this.tilemap,
            actors
        }
    }
}

export default dungeon;