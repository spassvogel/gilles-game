import { deductActorAp, modifyEnemyHealth, setCombat, startTurn } from 'store/actions/quests'
import { type AnyAction } from 'redux'
import { type Location, locationEquals } from 'utils/tilemap'
import { type ActorObject, Allegiance, type EnemyObject, getUniqueName, isAdventurer, type SceneAction, SceneActionType, isActorObject } from 'store/types/scene'
import { type BaseSceneController } from './BaseSceneController'
import { Channel, MixMode, SoundManager } from 'global/SoundManager'
import { getDefinition as getWeaponDefinition, type Weapon } from 'definitions/items/weapons'
import { getDefinition as getEnemyTypeDefinition } from 'definitions/enemies'
import { AP_COST_MELEE, AP_COST_SHOOT, rollBodyPart, rollToDodge, rollToHit } from 'mechanics/combat'
import { EquipmentSlotType } from 'components/ui/adventurer/EquipmentSlot'
import { type TextEntry } from 'constants/text'
import { apparelTakeDamage, changeEquipmentQuantity, modifyHealth } from 'store/actions/adventurers'
import { type WeaponWithAbility, type ActionIntent } from 'components/world/QuestPanel/QuestDetails/scene/ui/SceneUI'
import { getDefinition, isApparel } from 'definitions/items/apparel'
import { TextManager } from 'global/TextManager'
import { DamageType, WeaponType } from 'definitions/weaponTypes/types'
import { type Item } from 'definitions/items/types'
import { WeaponAbility } from 'definitions/abilities/types'
import { ToastManager } from 'global/ToastManager'
import { Type } from 'components/ui/toasts/Toast'

// todo: dont use a class anymore
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class CombatController {
  static sceneController: BaseSceneController<unknown>

  protected static unsubscriber: () => void

  static initialize (sceneController: BaseSceneController<unknown>) {
    this.sceneController = sceneController

    const storeChange = this.handleStoreChange.bind(this)
    this.unsubscriber = sceneController.store.subscribe(storeChange)
    // const selectQuest = createSelector(
    //   [getQuests],
    //   (quests: QuestStoreState[]) => { return quests.find(q => q.name === sceneController.questName) }
    // )
  }

  static destroy () {
    this.unsubscriber?.()
  }

  // Fires when the store changes
  static handleStoreChange () {
    if (this.sceneController == null) return
    if (!this.sceneController.combat) return

    // const questState = this.getQuestStoreState()
    const adventurers = this.sceneController.sceneAdventurers
    const enemies = this.sceneController.sceneEnemies
    const quest = this.sceneController.quest
    if (adventurers != null && enemies != null && quest != null && quest.scene != null && ((quest.scene.actionQueue?.length ?? 0) === 0)) {
      const totalAdventurerAp = adventurers.reduce((acc, value) => acc + value.ap, 0)
      const { scene } = quest
      const { turn } = scene

      if (this.sceneController.getAdventurers().every(a => a.health <= 0)) {
        // All adventurers are dead T_T quest failed!
        const questTitle = TextManager.getQuestTitle(quest.name)
        const leader = this.sceneController.getAdventurers()[0]
        ToastManager.addToast(questTitle, Type.questFailed, leader?.avatarImg)
        console.log("BOOM")
        this.dispatch(setCombat(quest.name, false))
        return
      }

      // No AP for the player left, switch to enemy turn
      if (totalAdventurerAp === 0 && turn === Allegiance.player) {
        this.dispatch(startTurn(quest.name, Allegiance.enemy))
        return
      }

      const totalEnemiesAp = enemies.reduce((acc, e) => acc + Math.max(e.ap, 0), 0)
      if (totalEnemiesAp === 0 && turn === Allegiance.enemy) {
        // No more AP left for the enemy, player turn
        this.dispatch(startTurn(quest.name, Allegiance.player, this.sceneController.getAdventurers()))
        return
      }

      if (turn === Allegiance.enemy) {
        this.enemyAI()
      }
    }
  }

  // Moves the enemy AI does
  static enemyAI () {
    const enemy = this.findEnemyWithAp()

    if (enemy?.location != null) {
      const isAlive = (actor: ActorObject) => isAdventurer(actor) && (this.sceneController?.getAdventurerByActor(actor)?.health ?? 0) > 0
      const target = this.findNearestActor(enemy.location, Allegiance.player, isAlive)
      if ((target == null) || (target.location == null)) return // no target? did everyone die?

      // todo: different types of weapons
      const enemyTypeDefinition = getEnemyTypeDefinition(enemy.enemyType)
      const weapon = enemyTypeDefinition.mainHand
      const ability = WeaponAbility.swing
      const weaponWithAbility: WeaponWithAbility = { weapon, ability }

      const intent = this.sceneController.createActionIntent(SceneActionType.melee, enemy, target.location, weaponWithAbility)
      if ((intent == null) || intent.action !== SceneActionType.melee) return

      this.sceneController.actorAttemptAction(intent)
      // this.dispatch(enqueueSceneAction(quest.name, sceneAction))
      // if (intent.apCost != null) {
      //   this.dispatch(deductActorAp(this.questName, getUniqueName(enemy), intent.apCost))
      // }
    }
  }

  // Called when actor melee animation starts
  public static actorMeleeStart (actorId: string, _intent: ActionIntent) {
    if (this.sceneController === undefined) return

    void SoundManager.playSound('SCENE_SWISH', Channel.scene, false, MixMode.singleInstance)
    const actor = this.sceneController.getSceneActor(actorId)
    if (actor == null) throw new Error('No actor found')
    const weapon = this.getActorMainhandItem(actor)
    if (weapon == null) throw new Error('No weapon found')
    const definition = getWeaponDefinition(weapon.type)

    switch (definition.weaponType) {
      case WeaponType.knife: {
        void SoundManager.playSound('SCENE_DAGGER_SWISH', Channel.scene, false, MixMode.singleInstance)
        break
      }
      default: {
        void SoundManager.playSound('SCENE_SWISH', Channel.scene, false, MixMode.singleInstance)
        break
      }
    }
  }

  public static actorMeleeEnd (actorId: string, intent: ActionIntent) {
    const location = intent.to

    // todo: this AP probably has to be paid up front!
    const ap = AP_COST_MELEE
    this.dispatch(deductActorAp(this.questName, actorId, ap))

    const actor = this.sceneController.getSceneActor(actorId)
    if (actor == null) throw new Error('No actor found')
    if (intent.action !== SceneActionType.melee) throw new Error('Wrong action type')

    const { weapon } = intent.weaponWithAbility
    if (weapon === undefined) throw new Error('No weapon found')
    const weaponDefinition = getWeaponDefinition(weapon.type)
    const skills = this.sceneController.getActorSkills(actor)

    // Roll to hit
    if (!rollToHit(skills[weaponDefinition.weaponType])) {
      this.meleeMissed(actor, weapon, ap, location)
    } else {
      // Hit
      const [target] = this.sceneController.getObjectsAtLocation(location, isActorObject) as unknown as ActorObject[]
      const targetAttributes = this.sceneController.getActorAttributes(target)

      if (rollToDodge(targetAttributes)) {
        this.meleeDodged(actor, target, weapon, location)
      } else {
        // Hit!
        this.meleeHit(actor, target, weapon, location)
      }
    }
  }

  public static actorShootStart (actorId: string, intent: ActionIntent) {
    const actor = this.sceneController.getSceneActor(actorId)
    if (actor == null) throw new Error('No actor found')
    if (intent.action !== SceneActionType.shoot) throw new Error('Wrong action type')
    const { weapon } = intent.weaponWithAbility
    if (weapon === undefined) throw new Error('No weapon found')
    const definition = getWeaponDefinition(weapon.type)

    switch (definition.weaponType) {
      case WeaponType.bow: {
        void SoundManager.playSound('SCENE_BOW', Channel.scene, false, MixMode.singleInstance)
        break
      }
      case WeaponType.crossbow: {
        void SoundManager.playSound('SCENE_CROSSBOW', Channel.scene, false, MixMode.singleInstance)
        break
      }
    }

    const { ammo } = intent
    if (ammo !== undefined && isAdventurer(actor)) {
      let quantity = (ammo.quantity ?? 1)
      this.dispatch(changeEquipmentQuantity(actorId, EquipmentSlotType.offHand, --quantity))
    }
  }

  public static actorShootEnd (actorId: string, intent: ActionIntent) {
    const ap = AP_COST_SHOOT
    const location = intent.to
    // Take away AP for shooting
    this.dispatch(deductActorAp(this.questName, actorId, ap))
    const actor = this.sceneController.getSceneActor(actorId)
    if (actor == null) throw new Error('No actor found')
    if (intent.action !== SceneActionType.shoot) throw new Error('Wrong action type')
    const { weapon } = intent.weaponWithAbility
    if (weapon === undefined) throw new Error('No weapon found')
    const weaponDefinition = getWeaponDefinition(weapon.type)
    const skills = this.sceneController.getActorSkills(actor)

    // Roll to hit
    if (!rollToHit(skills[weaponDefinition.weaponType])) {
      this.shootMissed(actor, weapon, ap, location)
    } else {
      // Hit
      const [target] = this.sceneController.getObjectsAtLocation(location, isActorObject) as unknown as ActorObject[]
      const targetAttributes = this.sceneController.getActorAttributes(target)

      if (rollToDodge(targetAttributes)) {
        this.shootDodged(actor, target, weapon, location)
      } else {
        // Hit!
        this.shootHit(actor, target, weapon, location)
      }
    }
  }

  private static getQuestStoreState () {
    return this.sceneController?.store.getState().quests.find(q => q.name === this.sceneController?.questName)
  }

  /** Finds the actor nearest to `from`, but not ON `from` */
  private static findNearestActor (from: Location, allegiance?: Allegiance, additionalFilter?: (actor: ActorObject) => boolean) {
    if (this.sceneController === undefined) return undefined
    const actors = this.sceneController.sceneActors
    let distance = Number.MAX_VALUE
    let actor: ActorObject | undefined
    actors?.forEach(a => {
      if ((a.location == null) || locationEquals(a.location, from)) return
      const steps = this.sceneController.findPath(from, a.location)?.length
      if (steps !== undefined && steps < distance) {
        if ((allegiance === undefined || a.allegiance === allegiance) && additionalFilter?.(a) !== false) {
          distance = steps
          actor = a
        }
      }
    })
    return actor
  }

  protected static meleeMissed (actor: ActorObject, weapon: Item<Weapon>, ap: number, location: Location) {
    const weaponDefinition = getWeaponDefinition(weapon.type)
    const skills = this.sceneController.getActorSkills(actor)

    this.sceneController.bubbleAtLocation(TextManager.get('scene-combat-attack-miss'), location)

    this.log({
      key: this.settings.verboseCombatLog ? 'scene-combat-attack-slash-missed-verbose' : 'scene-combat-attack-slash-missed',
      context: {
        attacker: getUniqueName(actor),
        weapon,
        ap,
        weaponType: weaponDefinition.weaponType,
        skill: skills[weaponDefinition.weaponType]
      }
    })
  }

  protected static meleeDodged (actor: ActorObject, target: ActorObject, weapon: Item<Weapon>, location: Location) {
    this.sceneController.bubbleAtLocation(TextManager.get('scene-combat-attack-dodge'), location)

    // Dodged!
    this.log({
      key: 'scene-combat-attack-slash-dodged',
      context: {
        attacker: getUniqueName(actor),
        weapon,
        target: getUniqueName(target)
      }
    })
  }

  protected static meleeHit (actor: ActorObject, target: ActorObject, weapon: Item<Weapon>, location: Location) {
    const weaponDefinition = getWeaponDefinition(weapon.type)
    // todo: calculate damage types?
    // todo: CRIT
    const rawDamage = weaponDefinition.damage?.[DamageType.kinetic] ?? 0
    const bodyPart = rollBodyPart()
    const armor = this.getArmor(target, bodyPart)
    const damage = rawDamage - armor
    const mitigated = rawDamage - damage

    this.sceneController.bubbleAtLocation(`${damage}`, location)
    this.sceneController.effectAtLocation('blood_1/blood_1.json', location)
    void SoundManager.playSound('SCENE_SWORD_HIT_FLESH', Channel.scene)

    this.log({
      key: mitigated > 0 ? 'scene-combat-attack-slash-hit-mitigated' : 'scene-combat-attack-slash-hit',
      context: {
        attacker: getUniqueName(actor),
        weapon,
        bodyPart: TextManager.getEquipmentSlot(bodyPart),
        target: getUniqueName(target),
        damage,
        mitigated
      }
    })
    this.takeDamage(target, damage, armor, bodyPart)
  }

  protected static shootMissed (actor: ActorObject, weapon: Item<Weapon>, ap: number, location: Location) {
    const weaponDefinition = getWeaponDefinition(weapon.type)
    const skills = this.sceneController.getActorSkills(actor)

    this.sceneController.bubbleAtLocation(TextManager.get('scene-combat-attack-miss'), location)

    this.log({
      key: this.settings.verboseCombatLog ? 'scene-combat-attack-shoot-missed-verbose' : 'scene-combat-attack-shoot-missed',
      context: {
        attacker: getUniqueName(actor),
        weapon,
        ap,
        weaponType: weaponDefinition.weaponType,
        skill: skills[weaponDefinition.weaponType]
      }
    })
  }

  protected static shootDodged (actor: ActorObject, target: ActorObject, weapon: Item<Weapon>, location: Location) {
    this.sceneController.bubbleAtLocation(TextManager.get('scene-combat-attack-dodge'), location)

    // Dodged!
    this.log({
      key: 'scene-combat-attack-shoot-dodged',
      context: {
        attacker: getUniqueName(actor),
        weapon,
        target: getUniqueName(target)
      }
    })
  }

  protected static shootHit (actor: ActorObject, target: ActorObject, weapon: Item<Weapon>, location: Location) {
    const weaponDefinition = getWeaponDefinition(weapon.type)
    // todo: calculate damage types?
    // todo: CRIT
    const rawDamage = weaponDefinition.damage?.[DamageType.kinetic] ?? 0
    const bodyPart = rollBodyPart()
    const armor = this.getArmor(target, bodyPart)
    const damage = rawDamage - armor
    const mitigated = rawDamage - damage

    this.sceneController.bubbleAtLocation(`${damage}`, location)
    this.sceneController.effectAtLocation('blood_2/blood_2.json', location)

    this.log({
      key: mitigated > 0 ? 'scene-combat-attack-shoot-hit-mitigated' : 'scene-combat-attack-shoot-hit',
      context: {
        attacker: getUniqueName(actor),
        weapon,
        bodyPart: TextManager.getEquipmentSlot(bodyPart),
        target: getUniqueName(target),
        damage,
        mitigated
      }
    })
    this.takeDamage(target, damage, armor, bodyPart)
  }

  /** Find next enemy with ap */
  static findEnemyWithAp () {
    if (this.sceneController === undefined) return undefined
    const actors = this.sceneController.sceneActors
    return actors?.find(a => a.allegiance === Allegiance.enemy && a.ap > 0) as EnemyObject
  }

  protected static get questName () {
    return this.sceneController.questName
  }

  protected static getActorMainhandItem (actor: ActorObject) {
    if (isAdventurer(actor)) {
      const adventurer = this.sceneController.getAdventurerByActor(actor)
      if (adventurer == null) throw new Error('No adventurer found')
      return adventurer.equipment[EquipmentSlotType.mainHand]
    }
    const enemy = this.sceneController.getEnemyDefitionByActor(actor)
    return enemy.mainHand
  }

  protected static getArmor (actor: ActorObject, bodyPart: EquipmentSlotType) {
    if (isAdventurer(actor)) {
      const adventurer = this.sceneController.getAdventurerByActor(actor)
      if (adventurer == null) throw new Error('No adventurer found')
      const equipment = adventurer.equipment[bodyPart]?.type
      if (equipment === undefined || !isApparel(equipment)) return 0
      return getDefinition(equipment).damageReduction ?? 0
    }
    const enemy = this.sceneController.getEnemyDefitionByActor(actor)
    return enemy.armor[bodyPart] ?? 0
  }

  protected static takeDamage (actor: ActorObject, damage: number, armor: number, bodyPart: EquipmentSlotType) {
    let died = false
    if (isAdventurer(actor)) {
      this.dispatch(modifyHealth(actor.adventurerId, -damage))
      died = (this.sceneController.getAdventurerByActor(actor)?.health ?? Number.MAX_VALUE) - damage <= 0

      if (!died) {
        this.dispatch(apparelTakeDamage(actor.adventurerId, damage, bodyPart))
      }
    } else {
      this.dispatch(modifyEnemyHealth(this.questName, actor.enemyId, -damage))
      died = actor.health - damage <= 0
    }
    if (died) {
      this.log({
        key: 'scene-combat-dies',
        context: {
          actor: getUniqueName(actor)
        }
      })
    } else {
      // const decreasedDurability = decreaseDurability(damage, armor)
      // bodyPart
    }
  }

  // protected static getActorOffhandItem(actor: ActorObject) {
  //   if (isAdventurer(actor)) {
  //     const adventurer = this.sceneController.getAdventurerByActor(actor)
  //     if (!adventurer) throw new Error('No adventurer found')
  //     return adventurer.equipment[EquipmentSlotType.offHand]
  //   }
  //   const enemy = this.sceneController.getEnemyByActor(actor)
  //   return enemy.offHand
  // }

  static dispatch (action: AnyAction) {
    this.sceneController?.store.dispatch(action)
  }

  protected static log (input: string | TextEntry): void {
    this.sceneController.log(input)
  }

  public static get settings () {
    return this.sceneController.settings
  }
}
