import { BaseSceneController } from 'mechanics/scenes/BaseSceneController'
import { registerSceneController } from 'global/SceneControllerManager'
import { type SceneObject, type LootCache, type AdventurerObject, getUniqueName } from 'store/types/scene'
import { setActiveSceneInteractionModal } from 'store/actions/quests'
import { type Kill10BoarsQuestVars } from '../questVars'
import { Channel, type GameSound, MixMode, SoundManager } from 'global/SoundManager'
import { type Item } from 'definitions/items/types'

const TILE_DOOR_UPPER_CLOSED = 121 + 131
const TILE_DOOR_LOWER_CLOSED = 121 + 143
const TILE_DOOR_UPPER_OPEN = 121 + 107
const TILE_DOOR_LOWER_OPEN = 121 + 119

abstract class DungeonEncounterSceneController extends BaseSceneController<Kill10BoarsQuestVars> {

  // getLootCache(name: string): LootCache | undefined {
  //   return this.questVars.dungeon.lootCaches[name]
  // }

  // takeGoldFromCache(name: string) {
  //   super.takeGoldFromCache(name)  // first add gold to inventory
  //   const lootCache = this.getLootCache(name)
  //   if (lootCache){
  //     const questVars = this.questVars
  //     questVars.dungeon.lootCaches[name].gold = 0
  //     this.store.dispatch(updateQuestVars(this.questName, questVars))
  //   }
  // }

  // takeItemFromCache(itemIndex: number, name: string, adventurer: AdventurerStoreState, toSlot?: number) {
  //   super.takeItemFromCache(itemIndex, name, adventurer, toSlot)
  //   const lootCache = this.getLootCache(name)
  //   if (lootCache){
  //     const questVars = this.questVars
  //     const items = questVars.dungeon.lootCaches[name].items.filter((_: any, index: number) => index !== itemIndex)
  //     questVars.dungeon.lootCaches[name].items = items
  //     this.store.dispatch(updateQuestVars(this.questName, questVars))
  //   }
  // }
}

export class DungeonCanyonSceneController extends DungeonEncounterSceneController {
  jsonPath = 'scenes/dungeon/canyon-64.json'
}
export class DungeonEntranceSceneController extends DungeonEncounterSceneController {
  previousMusic?: GameSound

  jsonPath = 'scenes/dungeon/dungeon-entrance-64.json'

  getLootCache (_: string): LootCache | undefined {
    return this.questVars.dungeon.entrance.chest
  }

  takeGoldFromCache (name: 'chest') {
    super.takeGoldFromCache(name) // first add gold to inventory
    this.updateQuestVars({
      dungeon: { entrance: { chest: { gold: 0 } } }
    })
  }

  takeItemFromCache (itemIndex: number, name: string, adventurerId: string, toSlot?: number) {
    super.takeItemFromCache(itemIndex, name, adventurerId, toSlot)
    const lootCache = this.getLootCache(name)
    if (lootCache != null) {
      const items = lootCache.items.filter((_: Item, index: number) => index !== itemIndex)
      this.updateQuestVars({
        dungeon: { entrance: { chest: { items } } }
      })
    }
  }

  updateScene (objects: SceneObject[] = this.sceneObjects, combat: boolean = this.combat) {
    objects = objects.map(o => {
      switch (o.name) {
        case 'chest': {
          return {
            ...o,
            gid: this.questVars.dungeon.entrance.chestOpen ? this.tileTypes['chest.open'] : this.tileTypes['chest.closed']
          }
        }
      }
      return o
    })
    super.updateScene(objects, combat)
  }

  interactWithObject (actor: AdventurerObject, object: SceneObject) {
    switch (object.name) {
      // todo: I want to share this common stuff with other SceneControllers
      case 'chest':
        if (!this.questVars.dungeon.entrance.chestOpen) {
          const textEntry = { key: 'quest-common-adventurer-opened-chest', context: { adventurer: getUniqueName(actor) } }
          this.questUpdate(textEntry, '/img/items/misc/chest-02.png')

          this.updateQuestVars({
            dungeon: { entrance: { chestOpen: true } }
          })
        }
        // display loot modal
        this.store.dispatch(setActiveSceneInteractionModal(this.questName, {
          type: 'lootCache',
          lootCache: 'chest'
        }))
        break

      case 'altar':
        this.store.dispatch(setActiveSceneInteractionModal(this.questName, {
          type: 'situation',
          situation: 'altar'
        }))
        break
    }
    super.interactWithObject(actor, object)
  }

  sceneEntered () {
    if (!this.questVars.dungeon.entered) {
      // this.questUpdate("quest-kill10-boars-enter-dungeon-see-chest")
    }
    this.previousMusic = SoundManager.getCurrentlyPlaying(Channel.music)

    if (this.combat) {
      void SoundManager.playSound('MUSIC_COMBAT', Channel.music, true, MixMode.fade, true)
    } else {
      void SoundManager.playSound('MUSIC_VIOLETTES', Channel.music, true, MixMode.fade, true)
    }

    super.sceneEntered()
  }

  sceneExited () {
    if (this.previousMusic !== undefined) {
      void SoundManager.playSound(this.previousMusic, Channel.music, true, MixMode.fade, true)
    }

    super.sceneExited()
  }

  getSituation (situation: string, adventurerId?: string) {
    switch (situation) {
      // case 'altar':
      //   const questVars = this.questVars
      //   if (questVars.dungeon.situations.altar.candleLit) {
      //     return {
      //       title: 'quest-kill10-boars-dungeonentrance-altar',
      //       choices: [
      //         "quest-kill10-boars-dungeonentrance-altar-rummagedrawers"
      //       ]
      //     }
      //   }
      //   return {
      //     title: 'quest-kill10-boars-dungeonentrance-altar',
      //     choices: [
      //       "quest-kill10-boars-dungeonentrance-altar-lightcandle",
      //       "quest-kill10-boars-dungeonentrance-altar-rummagedrawers"
      //     ]
      //   }
      default:
        return super.getSituation(situation, adventurerId)
    }
  }

  handleSituationOptionClick (_situation: string, _option: string, _adventurerId: string) {
    // switch (situation) {
    // case 'altar': {
    //   switch (option) {
    //     case 'quest-kill10-boars-dungeonentrance-altar-lightcandle':
    //       const questVars = this.questVars
    //       questVars.dungeon.situations.altar.candleLit = true
    //       this.store.dispatch(updateQuestVars(this.questName, questVars))
    //       break

    //     case 'quest-kill10-boars-dungeonentrance-altar-rummagedrawers':
    //       // display loot modal!
    //       this.store.dispatch(setActiveSceneInteractionModal(this.questName, {
    //         type: 'lootCache',
    //         lootCache: 'altar'
    //       }))
    //       break
    //   }
    // }
    // }
  }
}

export class DungeonHallwaySceneController extends DungeonEncounterSceneController {
  // jsonPath = "scenes/ork-dungeon-level2.json"
  jsonPath = 'scenes/dungeon/dungeon-entry-64.json'

  getLootCache (_: string): LootCache | undefined {
    return this.questVars.dungeon.hallway.chest
  }

  sceneEntered () {
    console.log('ENTERED THE HALLWAy')
    super.sceneEntered()
  }

  interactWithObject (actor: AdventurerObject, object: SceneObject) {
    switch (object.name) {
      // todo: I want to share this common stuff with other SceneControllers
      case 'chest':
        if (!this.questVars.dungeon.hallway.chestOpen) {
          const adventurer = this.getAdventurerByActor(actor)?.name
          const textEntry = { key: 'quest-common-adventurer-opened-chest', context: { adventurer } }
          this.questUpdate(textEntry, '/img/items/misc/chest-02.png')

          this.updateQuestVars({
            dungeon: { hallway: { chestOpen: true } }
          })
        }
        // display loot modal
        this.store.dispatch(setActiveSceneInteractionModal(this.questName, {
          type: 'lootCache',
          lootCache: 'chest'
        }))
        break
      case 'door1':
        if (!this.questVars.dungeon.hallway.doorOpen) {
          this.store.dispatch(setActiveSceneInteractionModal(this.questName, {
            type: 'situation',
            situation: 'door'
          }))
        }
        break
      case 'latrine':
        this.questUpdate('quest-kill10-boars-dungeonentrance-latrine')
        break
    }
    super.interactWithObject(actor, object)
  }

  getSituation (situation: string, adventurerId?: string) {
    switch (situation) {
      case 'door': {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const adventurer = this.getAdventurerById(adventurerId!)
        if ((adventurer?.inventory.some(i => i?.type === 'questItem/key')) ?? false) {
          // Adventurer has key
          return {
            title: 'quest-kill10-boars-dungeonentrance-door',
            choices: [
              'quest-common-scenario-door-open'
            ]
          }
        }
        return {
          title: 'quest-kill10-boars-dungeonentrance-door',
          text: 'quest-kill10-boars-dungeonentrance-door-needs-key'
        }
      }
      default:
        return super.getSituation(situation, adventurerId)
    }
  }

  handleSituationOptionClick (situation: string, _option: string, adventurerId: string) {
    switch (situation) {
      case 'door': {
        // Only one option, to open
        this.updateQuestVars({
          dungeon: { hallway: { doorOpen: true } }
        })

        void SoundManager.playSound('SCENE_DOOR_OPEN', Channel.scene, false, MixMode.singleInstance)

        this.discardItemType('questItem/key', adventurerId)
        const adventurer = this.getAdventurerById(adventurerId)?.name
        const textEntry = { key: 'quest-common-adventurer-opened-door', context: { adventurer } }
        this.questUpdate(textEntry, '/img/items/misc/chest-02.png')

        this.dispatch(setActiveSceneInteractionModal(this.questName))
      }
    }
  }

  // Todo: figure out an easier way to do this
  takeItemFromCache (itemIndex: number, name: string, adventurerId: string, toSlot?: number) {
    super.takeItemFromCache(itemIndex, name, adventurerId, toSlot)
    const lootCache = this.getLootCache(name)
    if (lootCache != null) {
      const items = lootCache.items.filter((_: unknown, index: number) => index !== itemIndex)
      this.updateQuestVars({
        dungeon: { hallway: { chest: { items } } }
      })
    }
  }

  updateScene (objects: SceneObject[] = this.sceneObjects, combat: boolean = this.combat) {
    objects = objects.map(o => {
      switch (o.name) {
        case 'chest': {
          return {
            ...o,
            gid: this.questVars.dungeon.entrance.chestOpen ? this.tileTypes['chest.open'] : this.tileTypes['chest.closed']
          }
        }
        case 'door1': {
          if (this.questVars.dungeon.hallway.doorOpen) {
            const properties = { ...o.properties, blocksMovement: false, interactive: false }
            if (o.properties.part === 'upper') {
              return { ...o, gid: TILE_DOOR_UPPER_OPEN, properties }
            } else {
              return { ...o, gid: TILE_DOOR_LOWER_OPEN, properties }
            }
          } else {
            if (o.properties.part === 'upper') {
              return { ...o, gid: TILE_DOOR_UPPER_CLOSED }
            } else {
              return { ...o, gid: TILE_DOOR_LOWER_CLOSED }
            }
          }
        }
      }
      return o
    })
    super.updateScene(objects, combat)
  }
}

export class DungeonHub1Controller extends DungeonEncounterSceneController {
  jsonPath = 'scenes/dungeon/dungeon-hub1.json'
}

registerSceneController('kill10Boars', 'dungeon.canyon', DungeonCanyonSceneController)
registerSceneController('kill10Boars', 'dungeon.entrance', DungeonEntranceSceneController)
registerSceneController('kill10Boars', 'dungeon.hub1', DungeonHub1Controller)
registerSceneController('kill10Boars', 'dungeon.hallway', DungeonHallwaySceneController)
