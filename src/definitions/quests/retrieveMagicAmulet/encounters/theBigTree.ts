import { Store, AnyAction } from "redux";
import { EncounterDefinition, createActors } from 'definitions/quests/encounters';
import { RetrieveMagicAmuletQuestVars } from '..';
import { getExtendedTilemapObjects } from 'utils/tilemap';
import { adventurersOnQuest } from 'storeHelpers';
import { StoreState } from 'stores';
import { loadResource } from 'utils/pixiJs';
import { TiledMapData } from 'constants/tiledMapData';

const theBigTree: EncounterDefinition<RetrieveMagicAmuletQuestVars> = {
    startScene(store: Store<StoreState, AnyAction>, questName: string, sceneName?: string) {
        const state = store.getState();
        const tilemap = "scenes/ork-dungeon-level1.json";

        loadResource(`${process.env.PUBLIC_URL}/${tilemap}`, (resource) => {
            const mapData: TiledMapData = resource.data;
            const questVars = state.quests.find(q => q.name === questName)?.questVars;
            const scene = this.createScene(state, tilemap, mapData, questName, questVars);
        });
    
    },

    createScene(store, tilemap, tilemapData, questName, questVars) {
        const tilemapObjects = getExtendedTilemapObjects(tilemapData);
        const quest = store.quests.find(q => q.name === questName)!;
        const adventurers = adventurersOnQuest(store.adventurers, quest);
        const actors = createActors(tilemapObjects, adventurers);

        // todo: perhaps this should be a class such that stuff that repeats for every scene can be done in a base class
        return {
            sceneName: "theBigTree.entrance",
            tilemap,
            actors
        }
    }
}
export default theBigTree;