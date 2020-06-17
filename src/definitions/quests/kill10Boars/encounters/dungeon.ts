import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { SceneControllerManager } from 'global/SceneControllerManager';
import { TileObject, ActorObject } from 'stores/scene';
import { updateSceneObjectAction } from 'actions/quests';
import { TextManager } from 'global/TextManager';

const TILE_CHEST_CLOSED = 33; // todo: take this from json?
const TILE_CHEST_OPEN = 34; // todo: take this from json?
export class DungeonEntranceSceneController extends BaseSceneController {
    jsonPath = "scenes/ork-dungeon-level1.json";
    
    interactWithObject(actor: ActorObject, object: TileObject) {
        switch (object.name) {
            // todo: I want to share this common stuff with other SceneControllers
            case "chest":
                if (object.gid === TILE_CHEST_CLOSED) {
                    const adventurer = this.getAdventurerByActor(actor)?.name;
                    const title = TextManager.get("quest-common-adventurer-opened-chest", { adventurer });
                    this.toastQuestUpdate(title, "/img/items/misc/chest-02.png");
                    this.store.dispatch(updateSceneObjectAction(this.questName, object.id, { gid: TILE_CHEST_OPEN }));
                }
                // display loot modal!
                break;
        }
        super.interactWithObject(actor, object);
    }
}

export class DungeonHallwaySceneController extends BaseSceneController {
    jsonPath = "scenes/ork-dungeon-level2.json";
}

// export const register = () => {
    SceneControllerManager.registerSceneController("kill10Boars", "dungeon.entrance", DungeonEntranceSceneController);
    SceneControllerManager.registerSceneController("kill10Boars", "dungeon.hallway", DungeonHallwaySceneController);
// }
