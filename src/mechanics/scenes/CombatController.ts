import { deductActorAp, enqueueSceneAction, startTurn } from 'store/actions/quests';
import { AnyAction } from 'redux';
import { Location } from 'utils/tilemap';
import { ActorObject, Allegiance, isAdventurer, SceneAction, SceneActionType } from 'store/types/scene';
import { locationEquals } from 'utils/tilemap';
import { BaseSceneController, movementDuration } from './BaseSceneController';
import { Channel, MixMode, SoundManager } from 'global/SoundManager';
import { getDefinition as getWeaponDefinition, WeaponType } from 'definitions/items/weapons';
import { AP_COST_MELEE, AP_COST_SHOOT } from 'mechanics/combat';
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot';
import { TextEntry } from 'constants/text';
import { roll3D6 } from 'utils/random';
import { changeEquipmentQuantity } from 'store/actions/adventurers';
import { ActionIntent } from 'components/world/QuestPanel/QuestDetails/scene/ui/SceneUI';


export class CombatController {
  static sceneController: BaseSceneController<unknown>;

  protected static unsubscriber: () => void;

  static initialize(sceneController: BaseSceneController<unknown>) {
    this.sceneController = sceneController;

    const storeChange = this.handleStoreChange.bind(this);
    this.unsubscriber = sceneController.store.subscribe(storeChange);
    // const selectQuest = createSelector(
    //   [getQuests],
    //   (quests: QuestStoreState[]) => { return quests.find(q => q.name === sceneController.questName) }
    // )
  }

  static destroy() {
    this.unsubscriber?.();
  }

  static handleStoreChange() {
    if (!this.sceneController) return;
    // const questState = this.getQuestStoreState()
    const adventurers = this.sceneController.sceneAdventurers;
    const enemies = this.sceneController.sceneEnemies;
    const quest = this.sceneController.quest;
    if (adventurers && enemies && quest && quest.scene && !quest.scene.actionQueue?.length){
      const totalAdventurerAp = adventurers.reduce((acc, value) => acc + value.ap, 0);
      const { scene } = quest;
      const { turn } = scene;

      // No AP for the player left, switch to enemy turn
      if (totalAdventurerAp === 0 && turn === Allegiance.player) {

        this.dispatch(startTurn(quest.name, Allegiance.enemy));
        return;
      }


      if (turn === Allegiance.enemy && scene.actionQueue?.length === 0) {
        const totalEnemiesAp = enemies.reduce((acc, value) => acc + value.ap, 0);

        if (totalEnemiesAp === 0) {
          // No more AP left for the enemy, player turn
          this.dispatch(startTurn(quest.name, Allegiance.player, this.sceneController.getAdventurers()));
          return;
        }

        const enemy = this.findEnemyWithAp();
        if (enemy && enemy.location) {
          const target = this.findNearestActor(enemy.location, Allegiance.player);
          if (!target || !target.location) return; // no target? did everyone die?
          const path = this.sceneController.findPath(enemy.location, target.location);
          const intent = this.sceneController.createActionIntent(SceneActionType.move, enemy, target.location);
          if (!intent) return;

          path?.forEach((l, index) => {
            if (index >= enemy.ap - 1) return;
            const sceneAction: SceneAction = {
              actionType: SceneActionType.move,
              actorId: enemy.name,
              target: l as Location,
              endsAt: movementDuration * (index + 1) + performance.now(),
              intent,
            };
            this.dispatch(enqueueSceneAction(quest.name, sceneAction));
          });
        }
      }
    }
  }

  // Call when actor melee animation starts
  public static actorMeleeStart(actorId: string, intent: ActionIntent) {
    if (!this.sceneController) return;

    SoundManager.playSound('scene/swish', Channel.scene, false, MixMode.singleInstance);
    const actor = this.sceneController.getSceneActor(actorId);
    if (!actor) throw new Error('No actor found');
    const weapon = this.getActorMainhandItem(actor);
    if (!weapon) throw new Error('No weapon found');
    const definition = getWeaponDefinition(weapon.type);

    switch (definition.weaponType) {
      case WeaponType.knife: {
        SoundManager.playSound('scene/daggerSwish', Channel.scene, false, MixMode.singleInstance);
        break;
      }
      default: {
        SoundManager.playSound('scene/swish', Channel.scene, false, MixMode.singleInstance);
        break;
      }
    }
  }

  public static actorMeleeEnd(actorId: string, intent: ActionIntent) {
    const location = intent.to;
    // todo 08/08/2019 use CombatController : move to CombatController?
    const ap = AP_COST_MELEE;
    this.dispatch(deductActorAp(this.questName, actorId, ap));
    const actor = this.sceneController.getSceneActor(actorId);
    if (!actor) throw new Error('No actor found');
    const weapon = this.getActorMainhandItem(actor);
    if (!weapon) throw new Error('No weapon found');
    const definition = getWeaponDefinition(weapon.type);
    const skills = this.sceneController.getActorSkills(actor);
    const roll = roll3D6();
    if (roll <= (skills[definition.weaponType] ?? 0)) {
      console.log('HIT at ', location);
      this.sceneController.bubbleAtLocation('HIT', location);

    } else {
      this.sceneController.bubbleAtLocation('MISS', location);

      if (this.settings.verboseCombatLog) {
        this.log({ key: 'scene-combat-attack-slash-missed-verbose', context: {
          actor,
          weapon: weapon.type,
          ap,
          roll,
          weaponType: definition.weaponType,
          skill: skills[definition.weaponType],
        } });
      } else {
        this.log({ key: 'scene-combat-attack-slash-missed', context: { actor, weapon: weapon.type } });
      }
    }
    // todo: see if slash misses
    // todo: process the hit, take away any HP?
  }

  public static actorShootStart(actorId: string, _intent: ActionIntent) {
    const actor = this.sceneController.getSceneActor(actorId);
    if (!actor) throw new Error('No actor found');
    const weapon = this.getActorMainhandItem(actor);
    if (!weapon) throw new Error('No weapon found');
    const definition = getWeaponDefinition(weapon.type);

    switch (definition.weaponType) {
      case WeaponType.bow: {
        SoundManager.playSound('scene/bow', Channel.scene, false, MixMode.singleInstance);
        break;
      }
      case WeaponType.crossbow: {
        SoundManager.playSound('scene/crossbow', Channel.scene, false, MixMode.singleInstance);
        break;
      }
    }

    const ammo = this.getActorOffhandItem(actor);
    if (ammo && isAdventurer(actor)) {
      let quantity = (ammo.quantity || 1);
      this.dispatch(changeEquipmentQuantity(actorId, EquipmentSlotType.offHand, --quantity));
    }
  }

  public static actorShootEnd(actorId: string, _intent: ActionIntent) {
    const ap = AP_COST_SHOOT;
    // Take away AP for shooting
    this.dispatch(deductActorAp(this.questName, actorId, ap));
    const actor = this.sceneController.getSceneActor(actorId);
    if (!actor) throw new Error('No actor found');
    const weapon = this.getActorMainhandItem(actor);
    if (!weapon) throw new Error('No weapon found');
    const definition = getWeaponDefinition(weapon.type);
    const skills = this.sceneController.getActorSkills(actor);
    const roll = roll3D6();
    if (roll <= (skills[definition.weaponType] ?? 0)) {
      this.log({
        key: 'scene-combat-attack-shoot-hit',
        context: {
          actor,
          weapon,
        },
      });

    } else {
      if (this.settings.verboseCombatLog) {
        this.log({ key: 'scene-combat-attack-shoot-missed-verbose', context: {
          actor,
          weapon: weapon.type,
          ap,
          roll,
          weaponType: definition.weaponType,
          skill: skills[definition.weaponType],
        } });
      } else {
        this.log({
          key: 'scene-combat-attack-shoot-missed',
          context: { actor, weapon },
        });
      }
    }
    // todo: process the hit, take away any HP?
  } 

  static getQuestStoreState() {
    return this.sceneController?.store.getState().quests.find(q => q.name === this.sceneController?.questName);
  }

  /** Finds the actor nearest to `from`, but not ON from */
  static findNearestActor(from: Location, allegiance?: Allegiance) {
    if (!this.sceneController) return undefined;
    const actors = this.sceneController.sceneActors;
    let distance = Number.MAX_VALUE;
    let actor: ActorObject | undefined;
    actors?.forEach(a => {
      if (!a.location || !this.sceneController || locationEquals(a.location, from)) return;
      const steps = this.sceneController.findPath(from, a.location)?.length;
      if (steps !== undefined && steps < distance) {
        if (allegiance === undefined || a.allegiance === allegiance) {
          distance = steps;
          actor = a;
        }
      }
    });
    return actor;
  }

  /** Find next enemy with ap */
  static findEnemyWithAp() {
    if (!this.sceneController) return undefined;
    const actors = this.sceneController.sceneActors;
    return actors?.find(a => a.allegiance === Allegiance.enemy && a.ap > 0);
  }

  protected static get questName() {
    return this.sceneController.questName;
  }

  protected static getActorMainhandItem(actor: ActorObject) {
    if (isAdventurer(actor)) {
      const adventurer = this.sceneController.getAdventurerByActor(actor);
      if (!adventurer) throw new Error('No adventurer found');
      return adventurer.equipment[EquipmentSlotType.mainHand];
    }
    const enemy = this.sceneController.getEnemyByActor(actor);
    return enemy.mainHand;
  }
  
  protected static getActorOffhandItem(actor: ActorObject) {
    if (isAdventurer(actor)) {
      const adventurer = this.sceneController.getAdventurerByActor(actor);
      if (!adventurer) throw new Error('No adventurer found');
      return adventurer.equipment[EquipmentSlotType.offHand];
    }
    const enemy = this.sceneController.getEnemyByActor(actor);
    return enemy.offHand;
  }

  static dispatch(action: AnyAction) {
    this.sceneController?.store.dispatch(action);
  }

  protected static log(input: string | TextEntry): void {
    this.sceneController.log(input);
  } 

  public static get settings() {
    return this.sceneController.settings;
  }
}
