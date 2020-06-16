import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { SceneControllerManager } from 'global/SceneControllerManager';
import { TileObject } from 'stores/scene';
import { updateSceneObjectAction } from 'actions/quests';

const TILE_CHEST_OPEN = 34; // todo: take this from json?
export class DungeonEntranceSceneController extends BaseSceneController {
    jsonPath = "scenes/ork-dungeon-level1.json";
    
    interactWithObject(object: TileObject) {
        switch (object.name) {
            // todo: I want to share this common stuff with other SceneControllers
            case "chest":
                this.store.dispatch(updateSceneObjectAction(this.questName, object.id, { gid: TILE_CHEST_OPEN }));
                break;
        }
        super.interactWithObject(object);
    }
}

export class DungeonHallwaySceneController extends BaseSceneController {
    jsonPath = "scenes/ork-dungeon-level2.json";
}

// export const register = () => {
    SceneControllerManager.registerSceneController("kill10Boars", "dungeon.entrance", DungeonEntranceSceneController);
    SceneControllerManager.registerSceneController("kill10Boars", "dungeon.hallway", DungeonHallwaySceneController);
// }
