import { deductActorAp, enqueueSceneAction, startTurn } from "store/actions/quests";
import { StoreState } from "store/types";
import { Store, AnyAction, DeepPartial } from "redux";
import { Allegiance } from "store/types/combat";
import { ActorObject, SceneAction, SceneActionType } from "store/types/scene";
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
    // const { adventurers, enemies, quest } = this.sceneController ?? {};
    if (adventurers && enemies && quest && quest.scene){
      const totalAdventurerAp = adventurers.reduce((acc, value) => acc + value.ap, 0)
      const { scene } = quest;
      const { turn } = scene;
      // No AP for the player left, switch to enemy turn
      if (totalAdventurerAp === 0 && turn === Allegiance.player) {
        
        // console.log("END TURN", totalAdventurerAp, totalEnemiesAp)
        this.dispatch(startTurn(quest.name, Allegiance.enemy));
        return
      }
      
      
      if (turn === Allegiance.enemy && !scene.actionQueue?.length) {
        const totalEnemiesAp = enemies.reduce((acc, value) => acc + value.ap, 0)

        if (totalEnemiesAp === 0) {
          // No more AP left for the enemy, player turn
          this.dispatch(startTurn(quest.name, Allegiance.player));
          return
        }


        console.log("total enemy ap: ", totalEnemiesAp)
        const enemy = this.findEnemyWithAp()
        console.log("do smt with: ", enemy)
        if (enemy && enemy.location) {
          const target = this.findNearestActor(enemy.location, Allegiance.player);
          if (!target || !target.location) return // no target? did everyone die?
          console.log('attack ', target)
          const path = this.sceneController.findPath(enemy.location, target.location);

          this.dispatch(deductActorAp(quest.name, enemy.name, path?.length || 0));

          // if (this.combat) {
          //     const remaining = actor.ap || -1;
          //     if (remaining < (path?.length || 0)) {
          //         // return;
          //     }
          //     this.dispatch(deductActorAp(this.questName, actorId, path?.length || 0));
          // }
          path?.forEach((l, index) => {
              const sceneAction: SceneAction = {
                  actionType: SceneActionType.move,
                  actorId: enemy.name,
                  target: l as [number, number],
                  endsAt: movementDuration * (index + 1) + performance.now()
              };
              this.dispatch(enqueueSceneAction(quest.name, sceneAction));
          });
          // break;
        }

      }
      // console.log(totalAdventurerAp, totalEnemiesAp, quest.scene.turn )
    }
    // if (questState) {
    //   console.log(questState)
    //   console.log()
    // }
  }

  static getQuestStoreState() {
    return this.sceneController?.store.getState().quests.find(q => q.name === this.sceneController?.questName)
  }

  /** Finds the actor nearest to `from`, but not ON from */
  static findNearestActor(from: [number, number], allegiance?: Allegiance) {
    // const qss = this.getQuestStoreState();
    // qss?.scene.
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
          actor = a
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