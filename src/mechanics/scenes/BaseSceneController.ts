import { type Store } from 'redux'
import EventEmitter from 'events'
import type TypedEmitter from 'typed-emitter'
import { type Location, addAllTilesInLayerToList, locationEquals, TiledObjectType, parseProperties } from 'utils/tilemap'
import { type StoreState } from 'store/types'
import { LAYER_ACTOR, TiledLayerType, type TiledMapData, type TiledObjectData } from 'constants/tiledMapData'
import { AStarFinder } from 'astar-typescript'
import { type AdventurerStoreState } from 'store/types/adventurer'
import { setScene, setSceneName, exitEncounter, enqueueSceneAction, updateQuestVars, deductActorAp, endPlayerTurn } from 'store/actions/quests'
import {
  type SceneObject,
  type ActorObject,
  type LootCache,
  SceneActionType,
  type SceneAction,
  isActorObject,
  isAdventurer,
  isEnemy,
  Allegiance,
  type EnemyObject,
  type AdventurerObject,
  getUniqueName
} from 'store/types/scene'
import { ToastEmitter } from 'emitters/ToastEmitter'
import { type Action } from 'store/actions'
import { Type } from 'components/ui/toasts/Toast'
import { getQuestLink } from 'utils/routing'
import { type TextEntry, isTextEntry } from 'constants/text'
import * as TextManager from 'global/TextManager'
import { addLogEntry, addLogText } from 'store/actions/log'
import { getDefinition } from 'definitions/quests'
import { getDefinition as getEnemyDefinition } from 'definitions/enemies'
import { LogChannel } from 'store/types/logEntry'
import { addGold } from 'store/actions/gold'
import { addItemToInventory, consumeItem, removeItemFromInventory } from 'store/actions/adventurers'
import { adventurersOnQuest, getSceneObjectsAtLocation, getSceneObjectWithName } from 'store/helpers/storeHelpers'
import { type Item, type ItemType } from 'definitions/items/types'
import { Assets, Point, utils } from 'pixi.js'
import { AP_COST_CONSUME, AP_COST_MOVE, AP_COST_SHOOT, calculateInitialAP } from 'mechanics/combat'
import { xpToLevel } from 'mechanics/adventurers/levels'
import { type EnemyType } from 'definitions/enemies/types'
import { BubbleLayer, BubbleEmitter, type BubbleType } from 'emitters/BubbleEmitter'
import { convertIn, convertOut } from 'utils/aStar'
import { type ActionIntent, type WeaponWithAbility } from 'components/world/QuestPanel/QuestDetails/scene/ui/SceneUI'
import { type Ammunition } from 'definitions/items/ammunition'
import { calculateEffectiveAttributes } from 'mechanics/adventurers/attributes'
import { sprites } from 'bundles/sprites'
import { Channel, SoundManager } from 'global/SoundManager'
import { type DeepPartial } from 'utils/typescript'

const effectSpritesheetBasePath = '/img/scene/effects/'
export const movementDuration = 500 // time every tile movement takes

export const EVENT_SCENE_EFFECT = 'eventSceneEffect'
type SceneEffectsEvents = {
  [EVENT_SCENE_EFFECT]: (path: string, point: Point) => void
}

/**
 * This is a type of God class that knows pretty much everything about a scene
 */
export class BaseSceneController<TQuestVars> extends (EventEmitter as unknown as new () => TypedEmitter<SceneEffectsEvents>) {
  public questName: string
  public mapData?: TiledMapData
  public aStar?: AStarFinder
  public dataLoading = false
  public dataLoadComplete = false
  public store: Store<StoreState, Action>

  protected jsonPath?: string
  protected blockedTiles: Location[] = []
  protected tileTypes: Record<string, number> = {} // map tiletype to gid

  constructor (store: Store<StoreState, Action>, questName: string) {
    // eslint-disable-next-line constructor-super
    super()
    this.store = store
    this.questName = questName
  }

  readonly basePath = 'scenes'

  // Loads tiles from json, loads all scene assets
  async loadData (callback: () => void) {
    if (this.dataLoadComplete) {
      callback()
      return
    }
    if (this.jsonPath === undefined) {
      throw new Error('No jsonPath defined!')
    }
    this.dataLoading = true

    // Load map json
    await Assets.load(`${this.jsonPath}`)

    // load sounds
    // const promises = [
    //   SoundManager.addSound('scene/bow', ['sound/scene/bow-01.mp3', 'sound/scene/bow-02.mp3']),
    //   SoundManager.addSound('scene/crossbow', ['sound/scene/crossbow-01.mp3', 'sound/scene/crossbow-02.mp3', 'sound/scene/crossbow-03.mp3', 'sound/scene/crossbow-04.mp3']),
    //   SoundManager.addSound('scene/daggerSwish', ['sound/scene/dagger-swish.ogg']),
    //   SoundManager.addSound('scene/meleeHit', ['sound/scene/melee-hit-01.mp3', 'sound/scene/melee-hit-02.mp3', 'sound/scene/melee-hit-03.mp3']),
    //   SoundManager.addSound('scene/metalBash', ['sound/scene/metal-bash-01.mp3', 'sound/scene/metal-bash-02.mp3', 'sound/scene/metal-bash-03.mp3']),
    //   SoundManager.addSound('scene/parry', ['sound/scene/parry-01.ogg', 'sound/scene/parry-02.ogg']),
    //   SoundManager.addSound('scene/shieldBash', ['sound/scene/shield-bash-impact.mp3']),
    //   SoundManager.addSound('scene/swish', ['sound/scene/swish-01.mp3', 'sound/scene/swish-02.mp3', 'sound/scene/swish-03.mp3', 'sound/scene/swish-04.mp3']),
    //   SoundManager.addSound('scene/swordHitFlesh', ['sound/scene/sword-hit-flesh-01.mp3', 'sound/scene/sword-hit-flesh-02.mp3', 'sound/scene/sword-hit-flesh-03.mp3', 'sound/scene/sword-hit-flesh-04.mp3']),
    //   SoundManager.addSound('scene/doorOpen', ['sound/scene/door.ogg']),
    // ]

    // await Promise.all(promises)

    const resource = Assets.get<TiledMapData>(`${this.jsonPath}`)
    if (resource === undefined) {
      throw new Error(`No map data found at ${this.jsonPath}`)
    }
    this.mapData = resource

    // Create aStar based on blocked tiles
    this.createBlockedTiles()
    this.createTileTypes()
    this.aStar = this.createAStar()
    utils.clearTextureCache()

    for (const path of this.actorSpritesheetPaths) {
      await Assets.load(path)
    }
    for (const path of this.effectSpritesheetPaths) {
      await Assets.load(`${effectSpritesheetBasePath}${path}`)
    }

    this.dataLoadComplete = true
    this.dataLoading = false
    callback()
  }

  createBlockedTiles (objects?: SceneObject[]) {
    this.blockedTiles = []
    this.mapData?.layers.filter(layer => layer.visible).forEach(layer => {
      if ((layer.properties != null) && layer.properties.some(p => p.name === 'blocksMovement' && p.value === true)) {
        addAllTilesInLayerToList(this.blockedTiles, layer, layer.width)
      }
    })
    if (objects !== undefined) {
      objects?.forEach(o => {
        if (o.properties.blocksMovement === true && (o.location != null)) {
          this.blockedTiles.push(o.location)
        }
      })
    }
  }

  createTileTypes () {
    this.mapData?.tilesets.forEach((tileset) => {
      tileset.tiles?.forEach((tile) => {
        this.tileTypes[tile.type] = tile.id + tileset.firstgid
      })
    })
  }

  // Constructs the scene and dispatches it to be saved to the store
  createScene () {
    const objects = this.createObjects()
    const combat = false
    this.updateScene(objects, combat)
  }

  updateScene (objects: SceneObject[] = this.sceneObjects, combat: boolean = this.combat) {
    const scene = {
      ...this.quest.scene,
      objects,
      combat
    }
    this.dispatch(setScene(this.questName, scene))

    this.createBlockedTiles(objects)

    // Create aStar based on blocked tiles
    if (this.mapData != null) {
      this.aStar = this.createAStar()
    }
  }

  sceneEntered () {
    utils.clearTextureCache()
  }

  sceneExited () {

  }

  // Convenience function returns an object with tileWidth and tileHeight properties
  getTileDimensions () {
    return {
      tileWidth: this.mapData?.tilewidth ?? 0,
      tileHeight: this.mapData?.tileheight ?? 0
    }
  }

  actorMoved (actor: string, location: Location) {
    const isNotAnActor = (object: SceneObject) => !isActorObject(object)

    if (this.combat) {
      // Take away AP for moving
      this.dispatch(deductActorAp(this.questName, actor, AP_COST_MOVE))
    }
    const [destination] = this.getObjectsAtLocation(location, isNotAnActor)
    if (destination == null) return

    if (destination.type === TiledObjectType.portal) {
      // We've hit a portal
      if (destination.properties.exit) {
        // Exit the encounter
        const index = Math.floor(this.quest.progress) + 1
        const definition = getDefinition(this.questName)
        const node = definition.nodes[index]
        if (node.log != null) {
          // If the next node has a log entry, add it
          this.log(node.log)
        }
        this.dispatch(exitEncounter(this.questName))
      } else if (destination.properties.to != null) {
        // Load another scene
        this.dispatch(setSceneName(this.questName, destination.properties.to as string))
      }
    }
  }

  actorInteract (adventurerId: string, location: Location) {
    const actor = this.getSceneAdventurer(adventurerId)
    const [object] = this.getObjectsAtLocation(location)

    if (object == null) {
      console.warn('No object found')
      return
    }
    if (actor != null) {
      this.interactWithObject(actor, object)
    }
  }

  // todo: is this the same as createActionIntent?
  actorAttemptAction (intent: ActionIntent) {
    // Tries to perform action on given actor
    const { actor, action } = intent
    if (actor === undefined) return
    const { location } = actor
    if (location == null) throw new Error('No location found!')

    switch (action) {
      case SceneActionType.move: {
        // Find path to move using aStar
        const { to } = intent
        this.dispatch(enqueueSceneAction(this.questName, {
          endsAt: performance.now() + (intent.path?.length ?? 0 + 1) * movementDuration,
          intent
        }))

        if (this.combat) {
          // Take away AP for moving
          this.dispatch(deductActorAp(this.questName, getUniqueName(actor), AP_COST_MOVE * (intent.path?.length ?? 1)))
        } else {
          // Follow behaviour. Other adventurers follow this adventurer
          // Enemies move only in combat so this code will never get called for enemies
          const otherAdventurers = this.sceneAdventurers.filter(a => a !== actor)
          let availableLocations = this.findEmptyLocationsAround(to, 6)

          otherAdventurers.forEach((otherAdventurer, index) => {
            const health = this.getAdventurerByActor(otherAdventurer)?.health ?? 0
            if ((otherAdventurer.location == null) || health <= 0) {
              return
            }

            const closestPath = this.findClosestPath(otherAdventurer.location, availableLocations)
            if ((closestPath != null) && closestPath.length > 0) {
              availableLocations = availableLocations.filter(l => !locationEquals(l, closestPath[closestPath?.length - 1]))
              const otherIntent: ActionIntent = {
                ...intent,
                from: otherAdventurer.location,
                to: closestPath[closestPath?.length - 1],
                actor: otherAdventurer,
                path: closestPath
              }

              this.dispatch(enqueueSceneAction(this.questName, {
                endsAt: performance.now() + (otherIntent.path?.length ?? 0 + 1) * movementDuration,
                intent: otherIntent,
                delay: (index + 1) / 2
              }))
            }
          })
        }
        break
      }
      case SceneActionType.interact: {
        // bump off the last location from the path
        const path = ((intent.path != null) && intent.path?.length > 0) ? intent.path.slice(0, -1) : []
        const interactAction: SceneAction = {
          endsAt: movementDuration * (intent.path?.length ?? 0) + performance.now(),
          intent: {
            ...intent,
            path
          }
        }
        this.dispatch(enqueueSceneAction(this.questName, interactAction))
        break
      }
      case SceneActionType.melee: {
        // bump off the last location from the path
        const path = ((intent.path != null) && intent.path?.length > 0) ? intent.path.slice(0, -1) : []
        const meleeAction: SceneAction = {

          endsAt: movementDuration * (intent.path?.length ?? 0) + performance.now(),
          intent: {
            ...intent,
            path
          }
        }
        this.dispatch(enqueueSceneAction(this.questName, meleeAction))
        break
      }
      case SceneActionType.shoot: {
        const shootAction: SceneAction = {
          endsAt: 500 + performance.now(),
          intent
        }
        this.dispatch(enqueueSceneAction(this.questName, shootAction))
        break
      }
      case SceneActionType.consume: {
        if (!isAdventurer(intent.actor)) {
          throw new Error('Only adventurers can drink potions!')
        }
        const adventurer = this.getAdventurerByActor(intent.actor)
        if (adventurer == null) {
          throw new Error('No Adventurer found')
        }
        const fromSlot = adventurer.inventory.findIndex((i) => (intent.item === i))
        this.dispatch(consumeItem(adventurer.id, fromSlot))
        this.dispatch(deductActorAp(this.questName, getUniqueName(actor), AP_COST_CONSUME))
        void SoundManager.playSound('SCENE_DRINKING', Channel.scene)

        // Add log entry
        this.dispatch(addLogText('adventurer-drink-potion', {
          item: intent.item,
          adventurer: adventurer.id
        }, LogChannel.common))
      }
    }
  }

  findClosestPath (from: Location, locations: Location[]) {
    return locations.reduce<Location[] | undefined>((acc, value) => {
      const path = this.findPath(from, value)
      if (acc === undefined || ((path != null) && path?.length < acc.length)) {
        acc = path
      }
      return acc
    }, undefined)
  }

  interactWithObject (_actor: AdventurerObject, _object: SceneObject) {
    // override
  }

  // Converts pixel coordinate (where 0,0 is top left of the canvas) to scene location
  pointToSceneLocation (point: Point): Location {
    if (this.mapData?.tilewidth == null || this.mapData?.tileheight == null) {
      return [0, 0]
    }
    return [Math.floor(point.x / this.mapData.tilewidth), Math.floor(point.y / this.mapData.tilewidth)]
  }

  // returns the pixel coordinate of the top left corner of the given location
  public sceneLocationToPoint (location: Location): Point {
    if (((this.mapData?.tilewidth) == null) || ((this.mapData?.tileheight) === 0)) {
      return new Point()
    }
    return new Point(location[0] * this.mapData.tilewidth, location[1] * this.mapData.tileheight)
  }

  /**
   * Returns true if the tile is blocked
   * @param location location
   * @param blockedByObjects can be blocked by objects as well as static tiles
   */
  locationIsBlocked (location: Location, blockedByObjects = false) {
    if (this.blockedTiles.some((l) => locationEquals(l, location))) {
      return true
    }
    return blockedByObjects && this.getObjectsAtLocation(location).length > 0
  }

  /**
   * Returns true if the location is not inside the scene
   * @param location location
   */
  isLocationOutOfBounds (location: Location) {
    if (
      location[0] < 0 ||
      location[1] < 0 ||
      location[0] >= (this.mapData?.width ?? 0) ||
      location[1] >= (this.mapData?.height ?? 0)
    ) {
      return true
    }
    return false
  }

  // Returns true if outsie of the bounds of the map
  locationIsOutOfBounds (location: Location) {
    if (this.mapData == null) return true

    return location[0] < 0 || location[1] < 0 ||
      location[0] >= this.mapData.width ||
      location[1] >= this.mapData.height
  }

  // Should be overridden
  getLootCache (_name: string): LootCache | undefined {
    // Override this to retrieve LootCache from questvars
    return undefined
  }

  takeGoldFromCache (name: string) {
    // Override this to remove gold from questvars

    const lootCache = this.getLootCache(name)
    if (lootCache != null) {
      void SoundManager.playSound('UI_GOLD', Channel.ui)

      this.dispatch(addGold(lootCache.gold ?? 0))
    }
  }

  takeItemFromCache (itemIndex: number, name: string, adventurerId: string, toSlot?: number) {
    // Override this to remove items from questvars
    const lootCache = this.getLootCache(name)
    if (lootCache == null) return

    const item = lootCache.items[itemIndex]
    this.dispatch(addItemToInventory(adventurerId, item, toSlot))
  }

  discardItem (item: Item, adventurerId: string) {
    const adventurer = this.getAdventurerById(adventurerId)
    const itemIndex = adventurer?.inventory.indexOf(item)
    if (itemIndex !== undefined) {
      this.dispatch(removeItemFromInventory(adventurerId, itemIndex))
    }
  }

  // Discards first item of type
  discardItemType (itemType: ItemType, adventurerId: string) {
    const adventurer = this.getAdventurerById(adventurerId)
    const item = adventurer?.inventory.find(i => i?.type === itemType)
    if (item != null) {
      this.discardItem(item, adventurerId)
    }
  }

  getSituation (_situation: string, _adventurerId?: string): Situation | undefined {
    return undefined
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleSituationOptionClick (_situation: string, _option: string, _adventurerId: string) {
  }

  /**
   * Returns a path from two locations on the map
   * @param origin
   * @param target
   */
  findPath (origin: Location, target: Location) {
    if (this.isLocationOutOfBounds(origin) || this.isLocationOutOfBounds(target)) {
      return []
    }
    return this
      .aStar?.findPath(convertIn(origin), convertIn(target))
      .map(convertOut)
  }

  /**
   * Finds a path from origin to a tile next to target (closest from origin)
   * It doesn't matter if target is unpathable
   * @param origin
   * @param target
   */
  public findPathNearest (origin: Location, target: Location, includeLast = false) {
    // todo; shortcut, if already neighbour, return early
    const grid = this.aStar?.getGrid().getGridNodes()
    if (grid === undefined) return []

    const matrix = grid.map(r => r.map(c => (c.getIsWalkable() ? 0 : 1)))
    matrix[target[1]][target[0]] = 0 // make target pathable
    const tempAStar = new AStarFinder({
      grid: {
        matrix
      },
      includeStartNode: false,
      heuristic: 'Manhattan',
      weight: 0.2
    })

    return tempAStar.findPath(convertIn(origin), convertIn(target))
      .map(convertOut)
      .slice(0, includeLast ? undefined : -1)
  }

  /**
   * Searches around @param origin to find empty, pathable locations
   * @param origin location to search around
   * @param amount of locations to find
   * @param blockedByObjects can be blocked by objects as well as static tiles
   */
  public findEmptyLocationsAround (origin: Location, amount: number, blockedByObjects = false) {
    const results: Location[] = []
    let radius = 1

    const getTop = (): Location[] => {
      const y = -radius + origin[1]
      const result = []
      for (let x = -radius + origin[0]; x <= radius + origin[0]; x++) {
        result.push([x, y] as Location)
      }
      return result
    }
    const getRight = () => {
      const x = radius + origin[0]
      const result = []
      for (let y = -radius + 1 + origin[1]; y <= radius - 1 + origin[1]; y++) {
        result.push([x, y] as Location)
      }
      return result
    }
    const getBottom = () => {
      const y = radius + origin[1]
      const result = []
      for (let x = -radius + origin[0]; x <= radius + origin[0]; x++) {
        result.push([x, y] as Location)
      }
      return result
    }
    const getLeft = () => {
      const x = -radius + origin[0]
      const result = []
      for (let y = -radius + 1 + origin[1]; y <= radius - 1 + origin[1]; y++) {
        result.push([x, y] as Location)
      }
      return result
    }

    const notOutside = (location: Location) => {
      if (this.mapData == null) return false
      return location[0] >= 0 && location[0] < this.mapData.width &&
        location[1] >= 1 && location[1] < this.mapData.height
    }

    while (radius < (this.mapData?.width ?? 2)) {
      // determine locations in square radius
      const square: Location[] = [
        ...getTop(),
        ...getRight(),
        ...getBottom(),
        ...getLeft()
      ]
      const filtered = square.filter(l => notOutside(l) && !this.locationIsBlocked(l, blockedByObjects))
      results.push(...filtered.slice(0, amount - results.length))
      if (results.length === amount) break
      radius++
    }
    return results
  }

  /**
   * Calculates the AP costs to walk
   */
  calculateWalkApCosts (from: Location, to: Location) {
    return this.findPath(from, to)?.length ?? 0
  }

  /**
   *
   */
  // figure out if we need this *and* actorAttemptAction?
  createActionIntent (action: SceneActionType, actor: ActorObject, location: Location, weaponWithAbility?: WeaponWithAbility, ammo?: Item<Ammunition>): ActionIntent | undefined {
    const {
      location: from = [0, 0],
      ap: actorAP
    } = actor
    if (isAdventurer(actor)) {
      const adventurer = this.getAdventurerByActor(actor)
      if ((adventurer?.health ?? 0) <= 0) {
        return undefined
      }
    }
    const to = location ?? [0, 0]
    switch (action) {
      case SceneActionType.move: {
        const path = this.findPath(from, to)
        const apCost = this.combat ? this.calculateWalkApCosts(from, to) : 0
        const isValid = path !== undefined && path.length > 0

        return ({
          action,
          from,
          to,
          apCost,
          actor,
          actorAP,
          path,
          isValid
        })
      }

      case SceneActionType.melee: {
        const path = this.findPath(from, to)
        if (path == null) throw new Error('No path found')
        // const lastStep = path?.length > 1 ? path[path.length - 2] : path[path.length - 1]
        const apCost = this.calculateWalkApCosts(from, to)
        // if (!path) throw new Error("No path found")
        // todo properly calculate AP
        // const lastStep = path?.length > 1 ? path[path.length - 2] : path[path.length - 1]
        // const apCost = this.calculateWalkApCosts(from, lastStep) + AP_COST_MELEE
        const [target] = this.getObjectsAtLocation(location, isActorObject)

        // todo: from the ActionMenu we can only target enemies, but the AI should be able to target player adventurers!
        // const onEnemy = this.getObjectsAtLocation(location, isEnemy).length > 0
        // const isValid = onEnemy && (apCost ?? 0) <= (actorAP ?? 0)
        const isValid = (target != null)
        if (weaponWithAbility == null) return undefined

        return ({
          action,
          from,
          to,
          apCost,
          actor,
          actorAP,
          path,
          isValid,
          weaponWithAbility
        })
      }

      case SceneActionType.interact: {
        const path = this.findPathNearest(from, to, true)
        const isValid = true

        return ({
          action,
          from,
          to,
          actor,
          path,
          isValid
        })
      }
      case SceneActionType.shoot: {
        const apCost = AP_COST_SHOOT
        const onEnemy = this.getObjectsAtLocation(location, isEnemy).length > 0
        const isValid = onEnemy
        if (weaponWithAbility == null) return undefined
        if (ammo == null) return undefined

        return ({
          action,
          from,
          to,
          apCost,
          actor,
          actorAP,
          isValid,
          weaponWithAbility,
          ammo
        })
      }
    }
  }

  /**
   * Forfeits all player ap
   */
  public endTurn () {
    this.dispatch(endPlayerTurn(this.questName))
  }

  public getSceneActor (actorId: string): ActorObject | undefined {
    return getSceneObjectWithName(this.sceneActors, actorId) as ActorObject
  }

  public getSceneAdventurer (adventurerId: string): AdventurerObject | undefined {
    return this.sceneActors.find((s) => isAdventurer(s) && s.adventurerId === adventurerId) as AdventurerObject
  }

  /**
   *
   * @param location
   * @param additionalFilter can specifiy an additional filter
   * @returns list of objects at location
   */
  public getObjectsAtLocation (location: Location, additionalFilter: (object: SceneObject) => boolean = () => true) {
    return getSceneObjectsAtLocation(this.quest.scene?.objects ?? [], location, additionalFilter) ?? []
  }

  protected createAStar () {
    if (this.mapData == null) return
    const matrix: number[][] = []
    if (this.mapData !== undefined) {
      for (let y = 0; y < this.mapData.height; y++) {
        const row: number[] = []
        for (let x = 0; x < this.mapData.width; x++) {
          const location: Location = [x, y]
          const blocked = this.locationIsBlocked(location)
          row.push(blocked ? 1 : 0)
        }
        matrix.push(row)
      }
    }

    return new AStarFinder({
      grid: {
        matrix
      },
      includeStartNode: false,
      heuristic: 'Manhattan',
      weight: 0.2
    })
  }

  // Create SceneObject list from this.mapData
  protected createObjects (): SceneObject[] {
    if (this.mapData == null) {
      throw new Error('No mapData')
    }

    const objects: SceneObject[] = []
    let spawnNewObjects = true
    if (this.quest.sceneName != null && this.quest.objectsPrev[this.quest.sceneName] != null) {
      // We have already spawned the objects to this scene when the adventurers visited earlier
      // So only the adventurers need to be spawned
      objects.push(...this.quest.objectsPrev[this.quest.sceneName])
      spawnNewObjects = false
    }

    const objectLayers = this.mapData.layers.filter(layer => layer.type === TiledLayerType.objectgroup)
    const adventurerLocations: Location[] = [] // we will look for spawn points (portal) on the map and populate this array with locations around it
    const adventurers = this.getAdventurers()

    objectLayers.forEach(objectLayer => {
      objectLayer.objects.reduce((acc: SceneObject[], value: TiledObjectData) => {
        // reduce the props array into an object with key/values
        const properties = parseProperties(value.properties)
        const location: Location = [
          value.x / (this.mapData?.tilewidth ?? 1),
          (value.y - (value.gid != null ? value.height : 0)) / (this.mapData?.tileheight ?? 1)
        ]

        const object: SceneObject | null = {
          ...value,
          layerId: objectLayer.id,
          properties,
          location
        }
        if (object.type === TiledObjectType.portal) {
          if ((object.properties.to === '' && this.quest.sceneNamePrev == null) || object.properties.to === this.quest.sceneNamePrev) {
            const adventurers = this.getAdventurers()
            const locations = [
              location,
              ...this.findEmptyLocationsAround(location, adventurers.length - 1)
            ]
            adventurerLocations.push(...locations)
          }
        } else if (object.type === TiledObjectType.enemySpawn) {
          object.type = TiledObjectType.actor
          if (isActorObject(object)) { // typeguard, is always true but we need to tell typescript it's an actor
            object.allegiance = Allegiance.enemy
          }
          if (isEnemy(object)) { // typeguard, is always true but we need to tell typescript it's an actor
            const definition = getEnemyDefinition(object.properties.enemyType as EnemyType)
            const level = object.properties.level as number ?? 1
            object.enemyId = `${object.properties.enemyType}_${Math.random().toString(36).substring(7)}`
            object.enemyType = object.properties.enemyType as string
            object.health = Math.random() * 20 // todo
            object.ap = calculateInitialAP(definition.attributes, level)
            object.name = object.properties.name as string
            object.level = level
            object.allegiance = Allegiance.enemy
            object.properties.isSprite = true
            object.properties.spritesheet = definition.spritesheet
          }
        }

        if (object != null && spawnNewObjects) {
          acc.push(object)
        }
        return acc
      }, objects)
    })

    // Now spawn the adventurers!
    const actorLayer = objectLayers.find(oL => oL.name === LAYER_ACTOR)
    if (actorLayer == null) {
      throw new Error(`No layer with name ${LAYER_ACTOR} found in the map! "${this.jsonPath}"`)
    }
    const layerId = actorLayer.id

    if (adventurerLocations.length < adventurers.length) {
      console.warn(`Not enough spawn locations for adventurers found in ${this.jsonPath}`)
    }
    adventurerLocations.forEach((location, i) => {
      const adventurer = adventurers[i]
      if (adventurer == null || adventurer.health <= 0) {
        return
      }

      const level = xpToLevel(adventurer.xp)
      // todo: 2024-03-25 Strip down objects => cut down the chaff from this
      const adventurerObject: AdventurerObject = {
        id: 0,
        adventurerId: adventurer.id,
        location,
        layerId,
        visible: true,
        type: TiledObjectType.actor,
        ap: calculateInitialAP(adventurer.basicAttributes, level),
        allegiance: Allegiance.player,
        properties: {
          adventurerId: adventurer.id,
          isSprite: true,
          spritesheet: adventurer.spritesheet
        }
      }
      objects.push(adventurerObject)
    })

    return objects
  }

  // Scene
  public get combat () {
    return this.quest.scene?.combat === true
  }

  public get sceneObjects (): SceneObject[] {
    return (this.quest.scene?.objects) ?? []
  }

  public get sceneActors (): ActorObject[] {
    return this.sceneObjects.filter<ActorObject>(isActorObject)
  }

  public get sceneAdventurers (): AdventurerObject[] {
    return this.sceneObjects.filter<ActorObject>(isAdventurer) as AdventurerObject[]
  }

  public get sceneEnemies (): EnemyObject[] {
    return this.sceneObjects.filter<EnemyObject>(isEnemy)
  }

  // Quest
  public get quest () {
    const storeState = this.store.getState()
    const quest = storeState.quests.find(q => q.name === this.questName)
    if (quest == null) throw new Error('No quest :(')
    return quest
  }

  protected get questVars (): TQuestVars {
    return this.quest.questVars as TQuestVars
  }

  protected get actorSpritesheetPaths (): string[] {
    const adventurers = this.getAdventurers()

    const uniqueAdventurerSpritesheets = new Set(adventurers.map(a => sprites[a.spritesheet]))
    return [
      ...uniqueAdventurerSpritesheets,
      sprites.SCENE_ACTOR_ORC_AXE,
      sprites.SCENE_ACTOR_TROLL_SWORD, // todo: only load enemy sprites that are actually needed
      sprites.SCENE_ACTOR_TROLL_AXE // todo: only load enemy sprites that are actually needed
    ]
  }

  protected get effectSpritesheetPaths (): string[] {
    return [
      'blood_1/blood_1.json',
      'blood_2/blood_2.json'
    ]
  }

  public get settings () {
    return this.store.getState().settings
  }

  // Provide questvars to update
  protected updateQuestVars (updated: DeepPartial<TQuestVars>) {
    this.dispatch(updateQuestVars(this.questName, updated))
  }

  public getAdventurers (): AdventurerStoreState[] {
    const storeState = this.store.getState()
    return adventurersOnQuest(storeState.adventurers, this.quest)
  }

  public getAdventurerByActor (actor: AdventurerObject) {
    const storeState = this.store.getState()
    return storeState.adventurers.find(a => a.id === actor.adventurerId)
  }

  public getEnemyDefitionByActor (actor: EnemyObject) {
    return getEnemyDefinition(actor.enemyType)
  }

  protected getAdventurerById (id: string) {
    const storeState = this.store.getState()
    return storeState.adventurers.find(a => a.id === id)
  }

  public getActorSkills (actor: ActorObject) {
    if (isAdventurer(actor)) {
      const adventurer = this.getAdventurerByActor(actor)
      if (adventurer == null) throw new Error('No adventurer found')
      return adventurer.skills
    }
    const enemy = this.getEnemyDefitionByActor(actor)
    return enemy.skills
  }

  public getActorAttributes (actor: ActorObject) {
    if (isAdventurer(actor)) {
      const adventurer = this.getAdventurerByActor(actor)
      if (adventurer == null) throw new Error('No adventurer found')
      return calculateEffectiveAttributes(adventurer)
    }
    const enemy = this.getEnemyDefitionByActor(actor)
    return enemy.attributes
  }

  protected questUpdate (input: string | TextEntry, icon?: string, toast = false): void {
    const textEntry: TextEntry = isTextEntry(input) ? input : { key: input }
    const title = TextManager.getTextEntry(textEntry)
    if (toast) {
      ToastEmitter.addToast(title, Type.questUpdate, icon, getQuestLink(this.questName))
    }
    this.log(textEntry)
  }

  public log (input: string | TextEntry): void {
    const textEntry: TextEntry = isTextEntry(input) ? input : { key: input }
    this.dispatch(addLogEntry(textEntry, LogChannel.quest, this.questName))
  }

  public bubbleAtLocation (text: string, location: Location, bubbleType?: BubbleType) {
    const point = this.sceneLocationToPoint(location)
    point.set(point.x + (this.mapData?.tilewidth ?? 2) / 2, point.y)
    BubbleEmitter.addBubble(text, point, bubbleType, BubbleLayer.scene)
  }

  // Store
  protected dispatch (action: Action) {
    this.store.dispatch(action)
  }

  public effectAtLocation (effectPath: string, location: Location) {
    const point = this.sceneLocationToPoint(location)
    point.set(point.x, point.y)
    this.emit(EVENT_SCENE_EFFECT, `${effectSpritesheetBasePath}${effectPath}`, point)
  }
}

export type Situation = {
  title: string
  choices?: string[]
  text?: string
}
