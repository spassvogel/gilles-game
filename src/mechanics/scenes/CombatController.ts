import { createSelector } from "reselect";
import { startTurn } from "store/actions/quests";
import { StoreState } from "store/types";
import { Allegiance } from "store/types/combat";
import { QuestStoreState } from "store/types/quest";
import { BaseSceneController } from "./BaseSceneController";

const getQuests = (state: StoreState) => state.quests;

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
    const questState = this.getQuestStoreState()
    const adventurers = this.sceneController?.sceneAdventurers;
    const enemies = this.sceneController?.sceneEnemies;
    const quest = this.sceneController?.quest;
    // const { adventurers, enemies, quest } = this.sceneController ?? {};
    if (adventurers && enemies && quest && quest.scene){
      const totalAdventurerAp = adventurers.reduce((acc, value) => acc + value.ap, 0)
      const totalEnemiesAp = enemies.reduce((acc, value) => acc + value.ap, 0)
      if (totalAdventurerAp === 0 && quest.scene.turn === Allegiance.player) {
        
        console.log("END TURN", totalAdventurerAp, totalEnemiesAp)
        this.sceneController?.store.dispatch(startTurn(quest.name, Allegiance.enemy));

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

  static findNearestActor(from: [number, number], allegiance?: Allegiance) {
    // const qss = this.getQuestStoreState();
    // qss?.scene.
    if (!this.sceneController) return undefined;
    const actors = this.sceneController.sceneActors;
    let distance = Number.MAX_VALUE;
    let actor;
    actors?.forEach(a => {
      if (!a.location || !this.sceneController) return
      console.log(`lets try ${a.name}, ${a.location}`)
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
}