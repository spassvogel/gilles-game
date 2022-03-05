import { deductActorAp, enqueueSceneAction, modifyEnemyHealth, startTurn } from 'store/actions/quests';
import { AnyAction } from 'redux';
import { Location } from 'utils/tilemap';
import { ActorObject, Allegiance, EnemyObject, getUniqueName, isAdventurer, SceneAction, SceneActionType } from 'store/types/scene';
import { locationEquals } from 'utils/tilemap';
import { BaseSceneController, movementDuration } from './BaseSceneController';
import { Channel, MixMode, SoundManager } from 'global/SoundManager';
import { getDefinition as getWeaponDefinition } from 'definitions/items/weapons';
import { AP_COST_MELEE, AP_COST_SHOOT, calculateDodge, rollBodyPart, rollToDodge, rollToHit } from 'mechanics/combat';
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot';
import { TextEntry } from 'constants/text';
import { roll3D6 } from 'utils/random';
import { changeEquipmentQuantity, modifyHealth } from 'store/actions/adventurers';
import { ActionIntent } from 'components/world/QuestPanel/QuestDetails/scene/ui/SceneUI';
import {  getDefinition, isApparel } from 'definitions/items/apparel';
import { TextManager } from 'global/TextManager';
import { DamageType, WeaponType } from 'definitions/weaponTypes/types';


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
          if (!intent || intent.action !== SceneActionType.move) return;

          path?.forEach((l, index) => {
            if (index >= enemy.ap - 1) return;
            const sceneAction: SceneAction = {
              actionType: SceneActionType.move,
              actor: getUniqueName(enemy),
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
  public static actorMeleeStart(actorId: string, _intent: ActionIntent) {
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
    const ap = AP_COST_MELEE;
    this.dispatch(deductActorAp(this.questName, actorId, ap));
    const actor = this.sceneController.getSceneActor(actorId);
    if (!actor) throw new Error('No actor found');
    if (intent.action !== SceneActionType.melee) throw new Error('Wrong action type');
    const { weapon } = intent.weaponWithAbility;
    if (!weapon) throw new Error('No weapon found');
    const definition = getWeaponDefinition(weapon.type);
    const skills = this.sceneController.getActorSkills(actor);
    const roll = roll3D6();

    // Roll to hit
    if (roll <= (skills[definition.weaponType] ?? 0)) {
      console.log('HIT at ', location);

      const target = this.sceneController.getObjectAtLocation(location) as ActorObject;
      const targetAttributes = this.sceneController.getActorAttributes(target);
      const dodge = calculateDodge(targetAttributes);
      console.log('dodge ', dodge);
      this.sceneController.bubbleAtLocation('HIT', location);

    } else {
      this.sceneController.bubbleAtLocation('MISS', location);

      if (this.settings.verboseCombatLog) {
        this.log({ key: 'scene-combat-attack-slash-missed-verbose', context: {
          actor: getUniqueName(actor),
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

  public static actorShootStart(actorId: string, intent: ActionIntent) {
    const actor = this.sceneController.getSceneActor(actorId);
    if (!actor) throw new Error('No actor found');
    if (intent.action !== SceneActionType.shoot) throw new Error('Wrong action type');
    const { weapon } = intent.weaponWithAbility;
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

    const { ammo } = intent;
    if (ammo && isAdventurer(actor)) {
      let quantity = (ammo.quantity || 1);
      this.dispatch(changeEquipmentQuantity(actorId, EquipmentSlotType.offHand, --quantity));
    }
  }

  public static actorShootEnd(actorId: string, intent: ActionIntent) {
    const ap = AP_COST_SHOOT;
    // Take away AP for shooting
    this.dispatch(deductActorAp(this.questName, actorId, ap));
    const actor = this.sceneController.getSceneActor(actorId);
    if (!actor) throw new Error('No actor found');
    if (intent.action !== SceneActionType.shoot) throw new Error('Wrong action type');
    const { weapon } = intent.weaponWithAbility;
    if (!weapon) throw new Error('No weapon found');
    const weaponDefinition = getWeaponDefinition(weapon.type);
    const skills = this.sceneController.getActorSkills(actor);
    const target = this.sceneController.getObjectAtLocation(intent.to) as ActorObject;

    if (rollToHit(skills[weaponDefinition.weaponType])) {

      const targetAttributes = this.sceneController.getActorAttributes(target);
      if (rollToDodge(targetAttributes)){
        // Dodged!
        this.log({
          key: 'scene-combat-attack-shoot-dodged',
          context: {
            attacker: getUniqueName(actor),
            weapon,
            target: getUniqueName(target),
          },
        });
      } else {
        // Hit!
        // todo: calculate damage types?
        const rawDamage = weaponDefinition.damage?.[DamageType.kinetic] ?? 0;
        const bodyPart = rollBodyPart();
        const armor = this.getArmor(target, bodyPart);
        const damage = rawDamage - armor;
        const absorbed = rawDamage - damage;
        this.takeDamage(target, damage);

        this.log({
          key: 'scene-combat-attack-shoot-hit',
          context: {
            attacker: getUniqueName(actor),
            weapon,
            bodyPart: TextManager.getEquipmentSlot(bodyPart),
            target: getUniqueName(target),
            damage,
            absorbed,
          },
        });
      }


    } else {
      this.log({
        key: this.settings.verboseCombatLog ? 'scene-combat-attack-shoot-missed-verbose' : 'scene-combat-attack-shoot-missed',
        context: {
          attacker: getUniqueName(actor),
          weapon: weapon.type,
          ap,
          roll: rollToHit,
          weaponType: weaponDefinition.weaponType,
          skill: skills[weaponDefinition.weaponType],
        },
      });
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
    return actors?.find(a => a.allegiance === Allegiance.enemy && a.ap > 0) as EnemyObject;
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

  protected static getArmor(actor: ActorObject, bodyPart: EquipmentSlotType) {
    if (isAdventurer(actor)) {
      const adventurer = this.sceneController.getAdventurerByActor(actor);
      if (!adventurer) throw new Error('No adventurer found');
      const equipment = adventurer.equipment[bodyPart]?.type;
      if (!equipment || !isApparel(equipment)) return 0;
      return getDefinition(equipment).damageReduction ?? 0;
    }
    const enemy = this.sceneController.getEnemyByActor(actor);
    return enemy.armor[bodyPart] ?? 0;
  }

  protected static takeDamage(actor: ActorObject, damage: number) {
    if (isAdventurer(actor)) {
      this.dispatch(modifyHealth(actor.adventurerId, -damage));
    } else {
      this.dispatch(modifyEnemyHealth(this.questName, actor.enemyId, -damage));
    }
  }

  // protected static getActorOffhandItem(actor: ActorObject) {
  //   if (isAdventurer(actor)) {
  //     const adventurer = this.sceneController.getAdventurerByActor(actor);
  //     if (!adventurer) throw new Error('No adventurer found');
  //     return adventurer.equipment[EquipmentSlotType.offHand];
  //   }
  //   const enemy = this.sceneController.getEnemyByActor(actor);
  //   return enemy.offHand;
  // }

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
