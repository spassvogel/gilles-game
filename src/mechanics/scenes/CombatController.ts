import { enqueueSceneAction, startTurn } from "store/actions/quests";
import { AnyAction } from "redux";
import { ActorObject, Allegiance, SceneAction, SceneActionType } from "store/types/scene";
import { locationEquals } from "utils/tilemap";
import { BaseSceneController, movementDuration } from "./BaseSceneController";


export class CombatController {
  static sceneController?: BaseSceneController<unknown>;
  protected static unsubscriber: () => void;

  static initialize(sceneController: BaseSceneController<unknown>) {
    this.sceneController = sceneController;

    const storeChange = this.handleStoreChange.bind(this)
    this.unsubscriber = sceneController.store.subscribe(storeChange);
    // const selectQuest = createSelector(
    //   [getQuests],
    //   (quests: QuestStoreState[]) => { return quests.find(q => q.name === sceneController.questName) }
    // )
  }

  static destroy() {
    this.unsubscriber?.()
  }

  static handleStoreChange() {
    if (!this.sceneController) return
    // const questState = this.getQuestStoreState()
    const adventurers = this.sceneController.sceneAdventurers;
    const enemies = this.sceneController.sceneEnemies;
    const quest = this.sceneController.quest;
    if (adventurers && enemies && quest && quest.scene && !quest.scene.actionQueue?.length){
      const totalAdventurerAp = adventurers.reduce((acc, value) => acc + value.ap, 0)
      const { scene } = quest;
      const { turn } = scene;

      // No AP for the player left, switch to enemy turn
      if (totalAdventurerAp === 0 && turn === Allegiance.player) {

        this.dispatch(startTurn(quest.name, Allegiance.enemy));
        return
      }


      if (turn === Allegiance.enemy && scene.actionQueue?.length === 0) {
        const totalEnemiesAp = enemies.reduce((acc, value) => acc + value.ap, 0)

        if (totalEnemiesAp === 0) {
          // No more AP left for the enemy, player turn
          this.dispatch(startTurn(quest.name, Allegiance.player, this.sceneController.getAdventurers()));
          return
        }

        const enemy = this.findEnemyWithAp()
        if (enemy && enemy.location) {
          const target = this.findNearestActor(enemy.location, Allegiance.player);
          if (!target || !target.location) return // no target? did everyone die?
          const path = this.sceneController.findPath(enemy.location, target.location);

          path?.forEach((l, index) => {
            if (index >= enemy.ap - 1) return;
            const sceneAction: SceneAction = {
              actionType: SceneActionType.move,
              actorId: enemy.name,
              target: l as [number, number],
              endsAt: movementDuration * (index + 1) + performance.now()
            };
            this.dispatch(enqueueSceneAction(quest.name, sceneAction));
          });
        }
      }
    }
  }

  static getQuestStoreState() {
    return this.sceneController?.store.getState().quests.find(q => q.name === this.sceneController?.questName)
  }

  /** Finds the actor nearest to `from`, but not ON from */
  static findNearestActor(from: [number, number], allegiance?: Allegiance) {
    if (!this.sceneController) return undefined;
    const actors = this.sceneController.sceneActors;
    let distance = Number.MAX_VALUE;
    let actor: ActorObject | undefined;
    actors?.forEach(a => {
      if (!a.location || !this.sceneController || locationEquals(a.location, from)) return
      const steps = this.sceneController.findPath(from, a.location)?.length;
      if (steps !== undefined && steps < distance) {
        if (allegiance === undefined || a.allegiance === allegiance) {
          distance = steps;
          actor = a;
        }
      }
    })
    return actor
  }

  /** Find next enemy with ap */
  static findEnemyWithAp() {
    if (!this.sceneController) return undefined;
    const actors = this.sceneController.sceneActors;
    return actors?.find(a => a.allegiance === Allegiance.enemy && a.ap > 0)
  }

  static dispatch(action: AnyAction) {
    this.sceneController?.store.dispatch(action);
  }
}
