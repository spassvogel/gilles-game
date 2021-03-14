import { createSelector } from "reselect";
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

    const storeChange = this.storeChange.bind(this)
    this.unsubscriber = sceneController.store.subscribe(storeChange);
    // const selectQuest = createSelector(
    //   [getQuests],
    //   (quests: QuestStoreState[]) => { return quests.find(q => q.name === sceneController.questName) }
    // )
  }

  static destroy() {
    this.unsubscriber?.()
  }

  static storeChange() {
    const questState = this.getQuestStoreState()
    const adventurers = this.sceneController?.sceneAdventurers;
    const enemies = this.sceneController?.sceneEnemies;
    const quest = this.sceneController?.quest;
    // const { adventurers, enemies, quest } = this.sceneController ?? {};
    if (adventurers && enemies && quest && quest.scene){
      const totalAdventurerAp = adventurers.reduce((acc, value) => acc + value.ap, 0)
      const totalEnemiesAp = enemies.reduce((acc, value) => acc + value.ap, 0)
      if (totalAdventurerAp === 0 && quest.scene.turn === Allegiance.player)
      console.log(totalAdventurerAp, totalEnemiesAp)
    }
    // if (questState) {
    //   console.log(questState)
    //   console.log()
    // }
  }

  static getQuestStoreState() {
    return this.sceneController?.store.getState().quests.find(q => q.name === this.sceneController?.questName)

    // return selectQuestLogEntries;
  }
}