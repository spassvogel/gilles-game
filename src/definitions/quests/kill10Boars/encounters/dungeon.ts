import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { SceneControllerManager } from 'global/SceneControllerManager';


export class DungeonEntranceSceneController extends BaseSceneController {
    jsonPath = "scenes/ork-dungeon-level1.json";
}

export class DungeonHallwaySceneController extends BaseSceneController {
    jsonPath = "scenes/ork-dungeon-level2.json";
}

// export const register = () => {
    SceneControllerManager.registerSceneController("kill10Boars", "dungeon.entrance", DungeonEntranceSceneController);
    SceneControllerManager.registerSceneController("kill10Boars", "dungeon.hallway", DungeonEntranceSceneController);
// }
