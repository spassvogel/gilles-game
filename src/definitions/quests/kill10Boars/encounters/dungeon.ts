import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { SceneControllerManager } from 'global/SceneControllerManager';
import { SceneObject, ActorObject, LootCache } from 'stores/scene';
import { updateSceneObject, setActiveSceneInteractionModal, updateQuestVars } from 'actions/quests';
import { Kill10BoarsQuestVars } from '../questVars';
import { AdventurerStoreState } from 'stores/adventurer';
// tslint:disable: max-classes-per-file

const TILE_CHEST_CLOSED = 33; // todo: take this from json?
const TILE_CHEST_OPEN = 34; // todo: take this from json?

export class DungeonEntranceSceneController extends BaseSceneController<Kill10BoarsQuestVars> {
    jsonPath = "scenes/ork-dungeon-level1.json";

    interactWithObject(actor: ActorObject, object: SceneObject) {
        switch (object.name) {
            // todo: I want to share this common stuff with other SceneControllers
            case "chest":
                if (object.gid === TILE_CHEST_CLOSED) {
                    const adventurer = this.getAdventurerByActor(actor)?.name;
                    const textEntry = { key: "quest-common-adventurer-opened-chest", context: { adventurer } };
                    this.questUpdate(textEntry, "/img/items/misc/chest-02.png");
                    this.store.dispatch(updateSceneObject(this.questName, object.id, { gid: TILE_CHEST_OPEN }));
                }
                // display loot modal!
                this.store.dispatch(setActiveSceneInteractionModal(this.questName, {
                    type: 'lootCache',
                    lootCache: object.name
                }));
                break;

            case "altar":
                this.store.dispatch(setActiveSceneInteractionModal(this.questName, {
                    type: 'choices',
                    title: 'quest-kill10boars-dungeonentrance-altar',
                    choices: [
                        "quest-kill10boars-dungeonentrance-altar-lightcandle",
                        "quest-kill10boars-dungeonentrance-altar-rummagedrawers"
                    ]
                }));

                break;
        }
        super.interactWithObject(actor, object);
    }

    sceneEntered() {
        const vars = this.getQuestVars();
        if (!vars.dungeon.entered) {
            this.questUpdate("quest-kill10Boars-enter-dungeon-see-chest");
        }
    }

    getLootCache(name: string): LootCache | undefined {
        return this.getQuestVars().dungeon.lootCaches[name];
    }

    takeGoldFromCache(name: string) {
        super.takeGoldFromCache(name);  // first add gold to inventory
        const lootCache = this.getLootCache(name);
        if (lootCache){
            const questVars = this.getQuestVars();
            questVars.dungeon.lootCaches[name].gold = 0;
            this.store.dispatch(updateQuestVars(this.questName, questVars));
        }
    }


    takeItemFromCache(itemIndex: number, name: string, adventurer: AdventurerStoreState, toSlot?: number) {
        super.takeItemFromCache(itemIndex, name, adventurer, toSlot);
        const lootCache = this.getLootCache(name);
        if (lootCache){
            const questVars = this.getQuestVars();
            const items = questVars.dungeon.lootCaches[name].items.filter((_: any, index: number) => index !== itemIndex);
            questVars.dungeon.lootCaches[name].items = items;
            this.store.dispatch(updateQuestVars(this.questName, questVars));
        }
    }
}

export class DungeonHallwaySceneController extends BaseSceneController<Kill10BoarsQuestVars> {
    jsonPath = "scenes/ork-dungeon-level2.json";
}

SceneControllerManager.registerSceneController("kill10Boars", "dungeon.entrance", DungeonEntranceSceneController as any);
SceneControllerManager.registerSceneController("kill10Boars", "dungeon.hallway", DungeonHallwaySceneController as any);
