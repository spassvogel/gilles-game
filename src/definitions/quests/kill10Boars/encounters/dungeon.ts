import { Store, AnyAction } from "redux";
import { EncounterDefinition, createActors } from 'definitions/quests/encounters';
import { Kill10BoarsQuestVars } from '..';
import { getExtendedTilemapObjects } from 'utils/tilemap';
import { adventurersOnQuest } from 'storeHelpers';
import { StoreState } from 'stores';
import { loadResource } from 'utils/pixiJs';
import { TiledMapData } from 'constants/tiledMapData';
import { startEncounter } from 'actions/quests';


const dungeon: EncounterDefinition<Kill10BoarsQuestVars> = {
    //tilemap: "scenes/ork-dungeon-level2.json",

    startScene(store: Store<StoreState, AnyAction>, questName: string, sceneName: string = "entry") {
        const state = store.getState();
        const tilemaps = {
            "entry": "scenes/ork-dungeon-level1.json",
            "right": "scenes/ork-dungeon-level2.json"
        }
        const tilemap = tilemaps[sceneName];

        loadResource(`${process.env.PUBLIC_URL}/${tilemap}`, (resource) => {
            const mapData: TiledMapData = resource.data;
            const questVars = state.quests.find(q => q.name === questName)?.questVars;
            const scene = this.createScene(state, tilemap, mapData, questName, questVars);

            store.dispatch(startEncounter(questName, scene));
        });
    
    },

    createScene(store, tilemap, tilemapData, questName, questVars) {
        const tilemapObjects = getExtendedTilemapObjects(tilemapData);
        const quest = store.quests.find(q => q.name === questName)!;
        const adventurers = adventurersOnQuest(store.adventurers, quest);
        const actors = createActors(tilemapObjects, adventurers);

        // todo: perhaps this should be a class such that stuff that repeats for every scene can be done in a base class
        return {
            tilemap,
            actors
        }
    }
}

export default dungeon;