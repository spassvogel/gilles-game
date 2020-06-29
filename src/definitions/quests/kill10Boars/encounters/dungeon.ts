import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { SceneControllerManager } from 'global/SceneControllerManager';
import { TileObject, ActorObject } from 'stores/scene';
import { updateSceneObjectAction } from 'actions/quests';
import { Item } from 'definitions/items/types';
import { Kill10BoarsQuestVars } from '../questVars';
// tslint:disable: max-classes-per-file

const TILE_CHEST_CLOSED = 33; // todo: take this from json?
const TILE_CHEST_OPEN = 34; // todo: take this from json?

export class DungeonEntranceSceneController extends BaseSceneController<Kill10BoarsQuestVars> {
    jsonPath = "scenes/ork-dungeon-level1.json";

    createCaches() {
        return {
            "chest": {
                title: "encounter-dungeon-caches-chest",
                gold: 3,
                items: [
                    // Item.savageStaff,
                    // Item.battleAxe,
                    // Item.druidChest,
                    // Item.shoulders1,
                    Item.eye,
                    Item.fedora
                ]
            }
        };
    }

    interactWithObject(actor: ActorObject, object: TileObject) {
        switch (object.name) {
            // todo: I want to share this common stuff with other SceneControllers
            case "chest":
                if (object.gid === TILE_CHEST_CLOSED) {
                    const adventurer = this.getAdventurerByActor(actor)?.name;
                    const textEntry = { key: "quest-common-adventurer-opened-chest", context: { adventurer } };
                    this.questUpdate(textEntry, "/img/items/misc/chest-02.png");
                    this.store.dispatch(updateSceneObjectAction(this.questName, object.id, { gid: TILE_CHEST_OPEN }));
                }
                // display loot modal!
                break;
        }
        super.interactWithObject(actor, object);
    }

    sceneEntered() {
        const vars = this.getQuestVars();
        console.log("entered", vars);
    }
}

export class DungeonHallwaySceneController extends BaseSceneController<Kill10BoarsQuestVars> {
    jsonPath = "scenes/ork-dungeon-level2.json";
}

SceneControllerManager.registerSceneController("kill10Boars", "dungeon.entrance", DungeonEntranceSceneController as any);
SceneControllerManager.registerSceneController("kill10Boars", "dungeon.hallway", DungeonHallwaySceneController as any);
