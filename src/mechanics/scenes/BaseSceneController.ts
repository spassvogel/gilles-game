import { Store, AnyAction, DeepPartial } from "redux";
import { addAllTilesInLayerToList, locationEquals, TiledObjectType, parseProperties } from 'utils/tilemap';
import { StoreState } from 'store/types';
import { loadResourceAsync } from 'utils/pixiJs';
import { TiledLayerType, TiledMapData, TiledObjectData } from 'constants/tiledMapData';
import { AStarFinder } from 'astar-typescript';
import { AdventurerStoreState } from 'store/types/adventurer';
import { setScene, setSceneName, exitEncounter, enqueueSceneAction, updateQuestVars, deductActorAp, endPlayerTurn } from 'store/actions/quests';
import { SceneObject, ActorObject, LootCache, SceneActionType, SceneAction, isActorObject, isAdventurer, isEnemy, Allegiance } from 'store/types/scene';
import { ToastManager } from 'global/ToastManager';
import { Type } from 'components/ui/toasts/Toast';
import { getQuestLink } from 'utils/routing';
import { TextEntry, isTextEntry } from 'constants/text';
import { TextManager } from 'global/TextManager';
import { addLogEntry } from 'store/actions/log';
import { getDefinition } from 'definitions/quests';
import { getDefinition as getEnemyDefinition } from 'definitions/enemies';
import { getDefinition as getWeaponDefinition, WeaponType } from 'definitions/items/weapons';
import { LogChannel } from 'store/types/logEntry';
import { addGold } from 'store/actions/gold';
import { addItemToInventory, changeEquipmentQuantity, removeItemFromInventory } from 'store/actions/adventurers';
import { adventurersOnQuest } from 'store/helpers/storeHelpers';
import { Channel, MixMode, SoundManager } from 'global/SoundManager';
import { Item, ItemType } from "definitions/items/types";
import { Loader, Point } from "pixi.js";
import { AP_COST_MOVE, AP_COST_SHOOT, AP_COST_SLASH, calculateInitialAP } from "mechanics/combat";
import { xpToLevel } from "mechanics/adventurers/levels";
import { EnemyType } from "definitions/enemies/types";
import { EquipmentSlotType } from "components/ui/adventurer/EquipmentSlot";
import { roll3D6 } from "utils/random";

const spritesheetBasePath = "img/scene/actors/";
export const movementDuration = 500; // time every tile movement takes


/**
 * This is a type of God class that knows pretty much everything about a scene
 */
export class BaseSceneController<TQuestVars> {

  public questName: string;
  public mapData?: TiledMapData;
  public aStar?: AStarFinder;
  public dataLoading = false;
  public dataLoadComplete = false;
  public store: Store<StoreState, AnyAction>;

  protected jsonPath?: string;
  protected blockedTiles: [number, number][] = [];
  protected tileTypes: {[name: string]: number } = {}; // map tiletype to gid

  constructor(store: Store<StoreState, AnyAction>, questName: string) {
    this.store = store;
    this.questName = questName;
  }

  get basePath(): string | null {
    return `${process.env.PUBLIC_URL}/scenes`;
  }

  // Loads tiles from json, loads all scene assets
  async loadData(callback: () => void) {
    if (this.dataLoadComplete) {
      return callback();
    }
    if (!this.jsonPath) {
      throw new Error("No jsonPath defined!");
    }
    this.dataLoading = true;

    await loadResourceAsync(`${process.env.PUBLIC_URL}/${this.jsonPath}`);

    // load sounds
    const promises = [
      SoundManager.addSound("scene/bow", ["sound/scene/bow-01.mp3", "sound/scene/bow-02.mp3"]),
      SoundManager.addSound("scene/crossbow", ["sound/scene/crossbow-01.mp3", "sound/scene/crossbow-02.mp3", "sound/scene/crossbow-03.mp3", "sound/scene/crossbow-04.mp3"]),
      SoundManager.addSound("scene/daggerSwish", ["sound/scene/dagger-swish.ogg"]),
      SoundManager.addSound("scene/meleeHit", ["sound/scene/melee-hit-01.mp3", "sound/scene/melee-hit-02.mp3", "sound/scene/melee-hit-03.mp3"]),
      SoundManager.addSound("scene/metalBash", ["sound/scene/metal-bash-01.mp3", "sound/scene/metal-bash-02.mp3", "sound/scene/metal-bash-03.mp3"]),
      SoundManager.addSound("scene/parry", ["sound/scene/parry-01.ogg", "sound/scene/parry-02.ogg"]),
      SoundManager.addSound("scene/shieldBash", ["sound/scene/shield-bash-impact.mp3"]),
      SoundManager.addSound("scene/swish", ["sound/scene/swish-01.mp3", "sound/scene/swish-02.mp3", "sound/scene/swish-03.mp3", "sound/scene/swish-04.mp3"]),
      SoundManager.addSound("scene/doorOpen", ["sound/scene/door.ogg"]),
    ];

    // Promise.all(promises).then(async () => {
    await Promise.all(promises);

    const resource = Loader.shared.resources[`${process.env.PUBLIC_URL}/${this.jsonPath}`];
    if (!resource.data) {
      throw new Error(`No map data found at ${process.env.PUBLIC_URL}/${this.jsonPath}`)
    }
    this.mapData = resource.data;

    // Create aStar based on blocked tiles
    this.createBlockedTiles();
    this.createTileTypes();
    this.aStar = this.createAStar();

    const spritesheets = this.spritesheetPaths;
    for(const path of spritesheets) {
      await loadResourceAsync(path);
    }
    // PIXI.utils.clearTextureCache()
    this.dataLoadComplete = true;
    this.dataLoading = false;
    callback();
  }

  createBlockedTiles(objects?: SceneObject[]) {
    this.blockedTiles = [];
    this.mapData?.layers.filter(layer => layer.visible).forEach(layer => {
      if (layer.properties && layer.properties.some(p => p.name === 'blocksMovement' && p.value === true)){
        addAllTilesInLayerToList(this.blockedTiles, layer, layer.width);
      }
    });
    objects?.forEach(o => {
      if(o.properties.blocksMovement === true && o.location){
        this.blockedTiles.push(o.location);
      }
    });
  }

  createTileTypes() {
    this.mapData?.tilesets.forEach((tileset) => {
      tileset.tiles?.forEach((tile) => {
        this.tileTypes[tile.type] = tile.id + tileset.firstgid
      })
    });
  }

  // Constructs the scene and dispatches it to be saved to the store
  createScene() {
    const objects = this.createObjects();
    const combat = false;
    this.updateScene(objects, combat)
  }

  updateScene(objects: SceneObject[] = this.sceneObjects, combat: boolean = this.combat) {
    const scene = {
      ...this.quest.scene,
      objects,
      combat,
    }
    this.dispatch(setScene(this.questName, scene));

    this.createBlockedTiles(objects);

    // Create aStar based on blocked tiles
    if (this.mapData) {
      this.aStar = this.createAStar();
    }
  }

  sceneEntered() {
    return;
  }

  sceneExited() {
    return;
  }

  // Convenience function returns an object with tileWidth and tileHeight properties
  getTileDimensions() {
    return {
      tileWidth: this.mapData?.tilewidth || 0,
      tileHeight: this.mapData?.tileheight || 0
    }
  }

  actorMoved(actor: string, location: [number, number]) {
    const isNotAnActor = (object: SceneObject) => !isActorObject(object);
    const destination = this.getObjectAtLocation(location, isNotAnActor);
    if (!destination) return;

    if (this.combat) {
      // Take away AP for moving
      this.dispatch(deductActorAp(this.questName, actor, AP_COST_MOVE));
    }

    if (destination.type === TiledObjectType.portal) {

      // We've hit a portal
      if (destination.properties.exit) {
        // Exit the encounter
        const index = Math.floor(this.quest.progress) + 1;
        const definition = getDefinition(this.questName);
        const node = definition.nodes[index];
        if (node.log) {
          // If the next node has a log entry, add it
          this.log(node.log)
        }
        this.dispatch(exitEncounter(this.questName));
      }
      else if (destination.properties.to) {
        // Load another scene
        this.dispatch(setSceneName(this.questName, destination.properties.to as string))
      }
    }
  }

  actorSlashing(actorId: string, _location: [number, number]) {
    SoundManager.playSound("scene/swish", Channel.scene, false, MixMode.singleInstance);
    const actor = this.getSceneActor(actorId);
    if (!actor) throw new Error("No actor found");
    const weapon = this.getActorMainhandItem(actor);
    if (!weapon) throw new Error("No weapon found");
    const definition = getWeaponDefinition(weapon.type);

    switch(definition.weaponType) {
      case WeaponType.knife: {
        SoundManager.playSound("scene/daggerSwish", Channel.scene, false, MixMode.singleInstance);
        break;
      }
      default: {
        SoundManager.playSound("scene/swish", Channel.scene, false, MixMode.singleInstance);
        break;
      }
    }
  }

  actorSlashed(actorId: string, location: [number, number]) {
    const ap = AP_COST_SLASH;
    this.dispatch(deductActorAp(this.questName, actorId, ap));
    const actor = this.getSceneActor(actorId);
    if (!actor) throw new Error("No actor found");
    const weapon = this.getActorMainhandItem(actor);
    if (!weapon) throw new Error("No weapon found");
    const definition = getWeaponDefinition(weapon.type)
    const skills = this.getActorSkills(actor);
    const roll = roll3D6();
    if (roll <= (skills[definition.weaponType] ?? 0)) {
      console.log("HIT at ", location);

    } else {
      if (this.settings.verboseCombatLog) {
        this.log({ key: "scene-combat-attack-slash-missed-verbose", context: {
          actor,
          weapon: weapon.type,
          ap,
          roll,
          weaponType: definition.weaponType,
          skill: skills[definition.weaponType]
        }});
      } else {
        this.log({ key: "scene-combat-attack-slash-missed", context: { actor, weapon: weapon.type }});
      }
    }
    // todo: see if slash misses
    // todo: process the hit, take away any HP?
  }

  actorShooting(actorId: string, _location: [number, number]) {
    const actor = this.getSceneActor(actorId);
    if (!actor) throw new Error("No actor found");
    const weapon = this.getActorMainhandItem(actor);
    if (!weapon) throw new Error("No weapon found");
    const definition = getWeaponDefinition(weapon.type);

    switch(definition.weaponType) {
      case WeaponType.bow: {
        SoundManager.playSound("scene/bow", Channel.scene, false, MixMode.singleInstance);
      }
      break;
      case WeaponType.crossbow: {
        SoundManager.playSound("scene/crossbow", Channel.scene, false, MixMode.singleInstance);
      }
      break;
    }

    const ammo = this.getActorOffhandItem(actor);
    if (ammo && isAdventurer(actor)) {
      let quantity = (ammo.quantity || 1);
      this.dispatch(changeEquipmentQuantity(actorId, EquipmentSlotType.offHand, --quantity));
    }
  }

  actorShot(actorId: string, location: [number, number]) {
    const ap = AP_COST_SHOOT;
    // Take away AP for shooting
    this.dispatch(deductActorAp(this.questName, actorId, ap));
    const actor = this.getSceneActor(actorId);
    if (!actor) throw new Error("No actor found");
    const weapon = this.getActorMainhandItem(actor);
    if (!weapon) throw new Error("No weapon found");
    const definition = getWeaponDefinition(weapon.type)
    const skills = this.getActorSkills(actor);
    const roll = roll3D6();
    if (roll <= (skills[definition.weaponType] ?? 0)) {
      console.log("HIT at ", location);

    } else {
         if (this.settings.verboseCombatLog) {
          this.log({ key: "scene-combat-attack-shoot-missed-verbose", context: {
            actor,
            weapon: weapon.type,
            ap,
            roll,
            weaponType: definition.weaponType,
            skill: skills[definition.weaponType]
          }});
        } else {
          this.log({ key: "scene-combat-attack-shoot-missed", context: { actor, weapon: weapon.type }});
        }
    }
    // todo: process the hit, take away any HP?
  }

  actorInteract(actorId: string, location: [number, number]) {
    const actor = this.getSceneActor(actorId);
    const object = this.getObjectAtLocation(location);

    if (!object) {
      console.warn("No object found");
      return;
    }
    if (actor) {
      this.interactWithObject(actor, object);
    }
  }

  actorAttemptAction(actorId: string, type: SceneActionType, destination: [number, number]) {
    // Tries to perform action on given actor

    const actor = this.getSceneActor(actorId);
    if (!actor) return
    const {location} = actor;
    if (!location) throw new Error("No location found!")

    switch (type) {
      case SceneActionType.move: {
        // Find path to move using aStar
        const path = this.findPath(location, destination);

        if (this.combat) {
          const remaining = actor.ap || -1;
          if (remaining < (path?.length || 0)) {
            return;
          }
        }
        path?.forEach((l, index) => {
          // Queue up all the steps
          const sceneAction: SceneAction = {
            actionType: SceneActionType.move,
            actorId,
            target: l as [number, number],
            endsAt: movementDuration * (index + 1) + performance.now()
          };
          this.dispatch(enqueueSceneAction(this.questName, sceneAction));
        });
        break;
      }
      case SceneActionType.interact: {
        const path = this.findPathNearest(location, destination);
        path?.forEach((l, index) => {
          const moveAction: SceneAction = {
            actionType: SceneActionType.move,
            actorId,
            target: l as [number, number],
            endsAt: movementDuration * (index + 1) + performance.now()
          };
          this.dispatch(enqueueSceneAction(this.questName, moveAction));
        });

        const interactAction: SceneAction = {
          actionType: SceneActionType.interact,
          actorId,
          target: destination,
          endsAt: movementDuration * path.length + performance.now()
        };
        this.dispatch(enqueueSceneAction(this.questName, interactAction));
        break;
      }
      case SceneActionType.slash: {
        // Find path to move towards the target
        const path = this.findPath(location, destination);
        const target = path?.pop();
        if (!path || !target) {
          // No path possible.. cant do anything now
          return;
        }

        // Walk towards the target
        path?.forEach((l, index) => {
          const moveAction: SceneAction = {
            actionType: SceneActionType.move,
            actorId,
            target: l as [number, number],
            endsAt: movementDuration * (index + 1) + performance.now()
          };
          this.dispatch(enqueueSceneAction(this.questName, moveAction));
        });
        const meleeAction: SceneAction = {
          actionType: type,
          actorId,
          target,
          endsAt: movementDuration * (path.length + 1) + performance.now()
        };
        this.dispatch(enqueueSceneAction(this.questName, meleeAction));
        break;
      }
      case SceneActionType.shoot: {

        const shootAction: SceneAction = {
          actionType: type,
          actorId,
          target: destination,
          endsAt: 500 + performance.now()
        };
        this.dispatch(enqueueSceneAction(this.questName, shootAction));
      }
    }
  }

  interactWithObject(_actor: ActorObject, _object: SceneObject) {
    // override
  }

  // Converts pixel coordinate to scene location
  pointToSceneLocation (point: Point): [number, number] {
    if (!this.mapData?.tilewidth || !this.mapData?.tileheight) {
      return [0, 0];
    }
    return [Math.floor(point.x / this.mapData.tilewidth), Math.floor(point.y / this.mapData.tilewidth)];
  }

  // Returns true if the tile is blocked
  locationIsBlocked(location: [number, number]){
    return this.blockedTiles.some((l) => locationEquals(l, location));
  }

  // Returns true if outsie of the bounds of the map
  locationIsOutOfBounds(location: [number, number]) {
    if (!this.mapData) return true;

    return location[0] < 0 || location[1] < 0 ||
      location[0] >= this.mapData.width ||
      location[1] >= this.mapData.height;
  }

  // Should be overridden
  getLootCache(_name: string): LootCache | undefined {
    // Override this to retrieve LootCache from questvars
    return;
  }

  takeGoldFromCache(name: string) {
    // Override this to remove gold from questvars
    const lootCache = this.getLootCache(name);
    if (lootCache){
      this.dispatch(addGold(lootCache.gold || 0));
    }
  }

  takeItemFromCache(itemIndex: number, name: string, adventurerId: string, toSlot?: number) {
    // Override this to remove items from questvars
    const lootCache = this.getLootCache(name);
    if (!lootCache) return;

    const item = lootCache.items[itemIndex];
    this.dispatch(addItemToInventory(adventurerId, item, toSlot))
  }

  discardItem(item: Item, adventurerId: string) {
    const adventurer = this.getAdventurerById(adventurerId);
    const itemIndex = adventurer?.inventory.indexOf(item);
    if (itemIndex !== undefined) {
      this.dispatch(removeItemFromInventory(adventurerId, itemIndex));
    }
  }

  // Discards first item of type
  discardItemType(itemType: ItemType, adventurerId: string) {
    const adventurer = this.getAdventurerById(adventurerId);
    const item = adventurer?.inventory.find(i => i?.type === itemType);
    if (item) {
      this.discardItem(item, adventurerId);
    }
  }

  getSituation(_situation: string, _adventurerId?: string) : Situation | undefined {
     return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleSituationOptionClick(_situation: string, _option: string, _adventurerId: string) {
  }

  /**
   * Returns a path from two locations on the map
   * @param origin
   * @param target
   */
  findPath(origin: [number, number], target: [number, number]) {
    return this
      .aStar?.findPath(convertIn(origin), convertIn(target))
      .map(convertOut);
  }

  /**
   * Finds a path from origin to a tile next to target (closest from origin)
   * It doesn't matter if target is unpathable
   * @param origin
   * @param target
   */
  public findPathNearest(origin: [number, number], target: [number, number], includeLast = false) {
    // todo; shortcut, if already neighbour, return early
    const grid = this.aStar?.getGrid().getGridNodes();
    if (!grid) return [];

    const matrix = grid.map(r => r.map(c => (c.getIsWalkable() ? 0 : 1)));
    matrix[target[1]][target[0]] = 0; // make target pathable
    const tempAStar = new AStarFinder({
      grid: {
        matrix
      },
      includeStartNode: false,
      heuristic: "Manhattan",
      weight: 0.2,
    });

    return tempAStar.findPath(convertIn(origin), convertIn(target))
      .map(convertOut)
      .slice(0, includeLast ? undefined : -1);
  }

  /**
   * Searches around @param origin to find empty, pathable locations
   * @param origin location to search around
   * @param amount of locations to find
   */
  public findEmptyLocationsAround(origin: [number, number], amount: number) {
    const results: [number, number][] = [];
    let radius = 1;

    const getTop = (radius: number): [number, number][] => {
      const y = -radius + origin[1];
      const result = [];
      for (let x = -radius + origin[0]; x <= radius + origin[0]; x++) {
        result.push([x, y] as [number, number])
      }
      return result;
    }
    const getRight = (radius: number) => {
      const x = radius + origin[0];
      const result = [];
      for (let y = -radius + 1 + origin[1]; y <= radius - 1 + origin[1]; y++) {
        result.push([x, y] as [number, number])
      }
      return result;
    }
    const getBottom = (radius: number) => {
      const y = radius + origin[1];
      const result = [];
      for (let x = -radius + origin[0]; x <= radius + origin[0]; x++) {
        result.push([x, y] as [number, number])
      }
      return result;
    }
    const getLeft = (radius: number) => {
      const x = -radius + origin[0];
      const result = [];
      for (let y = -radius + 1 + origin[1]; y <= radius - 1 + origin[1]; y++) {
        result.push([x, y] as [number, number])
      }
      return result;
    }

    const notOutside = (location: [number, number]) => {
      if (!this.mapData) return false
      return location[0] >= 0 && location[0] < this.mapData.width
        && location[1] >= 1 && location[1] < this.mapData.height
    }

    while (radius < (this.mapData?.width ?? 2)) {
      // determine locations in square radius
      const square: [number, number][] = [
        ...getTop(radius),
        ...getRight(radius),
        ...getBottom(radius),
        ...getLeft(radius)
      ]
      const filtered = square.filter(l => notOutside(l) && !this.locationIsBlocked(l));
      results.push(...filtered.slice(0, amount - results.length))
      if (results.length === amount) break;
      radius++;
    }
    return results;
  }

  /**
   * Calculates the AP costs to walk
   */
  calculateWalkApCosts(from: [number, number], to: [number, number]) {
    return this.findPath(from, to)?.length || 0;
  }

  /**
   * Forfeits all player ap
   */
  public endTurn() {
    this.dispatch(endPlayerTurn(this.questName));
  }

  public getSceneActor(actorId: string): ActorObject | undefined {
    const actor = this.sceneActors.find(sA => sA.name === actorId);
    // if (!actor) throw new Error (`No actor found with id ${actorId}`);
    return actor;
  }

  /**
   *
   * @param location
   * @param additionalFilter can specifiy an additional filter
   * @returns
   */
  public getObjectAtLocation(location: [number, number], additionalFilter: (object: SceneObject) => boolean = () => true) {
    return this.quest.scene?.objects?.find(o => o.location && locationEquals(o.location, location) && additionalFilter(o))
  }

  protected createAStar() {
    if (!this.mapData) return
    const matrix: number[][] = [];
    if (this.mapData){
      for (let y = 0; y < this.mapData.height; y++) {
        const row: number[] = [];
        for (let x = 0; x < this.mapData.width; x++) {
          const location: [number, number] = [x, y];
          const blocked = this.locationIsBlocked(location);
          row.push(blocked ? 1 : 0);
        }
        matrix.push(row);
      }
    }

    return new AStarFinder({
      grid: {
        matrix
      },
      includeStartNode: false,
      heuristic: "Manhattan",
      weight: 0.2,
    });
  }

  // Create SceneObject from this.mapData
  protected createObjects(): SceneObject[] {
    if (!this.mapData) {
      throw new Error("No mapData");
    }

    const objectLayers = this.mapData.layers.filter(layer => layer.type === TiledLayerType.objectgroup);
    const objects: SceneObject[] = [];
    objectLayers.forEach(objectLayer => {
      objectLayer.objects.reduce((acc:  SceneObject[], value: TiledObjectData) => {

        // reduce the props array into an object with key/values
        const properties = parseProperties(value.properties);
        const location: [number, number] = [
          value.x / (this.mapData?.tilewidth || 1),
          (value.y - (value.gid ? value.height : 0)) / (this.mapData?.tileheight || 1)
        ];

        const object: SceneObject | null = {
          ...value,
          layerId: objectLayer.id,
          properties,
          location
        };

        if (object.type === TiledObjectType.portal) {
          if ((!object.properties.to && !this.quest.sceneNamePrev) || object.properties.to === this.quest.sceneNamePrev) {
            // todo: instead store location in var and spawn adventurers at the end
            const adventurers = this.getAdventurers();
            const { width, height, layerId } = object;
            const locations = [
              location,
              ...this.findEmptyLocationsAround(location, adventurers.length - 1)
            ];

            adventurers.forEach((adventurer, i) => {
              if (!object) throw new Error();

              const x = Math.round(object.x);
              const y = Math.round(object.y);
              const level = xpToLevel(adventurer.xp);
              const adventurerObject: ActorObject = {
                name: adventurer.id,
                id: adventurer.id,
                x,
                y,
                location: locations[i],
                width,
                height,
                layerId,
                visible: true,
                type: TiledObjectType.actor,
                ap: calculateInitialAP(adventurer.basicAttributes, level),
                health: adventurer.health,
                allegiance: Allegiance.player,
                properties: {
                  adventurerId: adventurer.id,
                  isSprite: true,
                  spritesheet: adventurer.spritesheetPath
                }
              }
              acc.push(adventurerObject);
            });
          }
        }
        else if (object.type === TiledObjectType.enemySpawn) {
          object.type = TiledObjectType.actor;
          if (isActorObject(object)) { // typeguard, is always true but we need to tell typescript it's an actor
            const definition = getEnemyDefinition(object.properties.name as EnemyType)
            const level = object.properties.level as number ?? 1;
            object.health = Math.random() * 100;
            object.ap = calculateInitialAP(definition.attributes, level)
            object.name = object.properties.name as string;
            object.level = level;
            object.allegiance = Allegiance.enemy;
            object.properties.isSprite = true;
            object.properties.spritesheet = definition.spritesheet;
          }
        }

        if (object) {
          acc.push(object);
        }
        return acc;
      }, objects);
    });
    return objects;
  }

  // Scene
  protected get combat() {
    return !!this.quest.scene?.combat;
  }

  public get sceneObjects(): SceneObject[]  {
    return this.quest.scene?.objects || [];
  }

  public get sceneActors(): ActorObject[] {
    return this.sceneObjects.filter<ActorObject>(isActorObject);
  }

  public get sceneAdventurers(): ActorObject[] {
    return this.sceneObjects.filter<ActorObject>(isAdventurer);
  }

  public get sceneEnemies(): ActorObject[] {
    return this.sceneObjects.filter<ActorObject>(isEnemy);
  }

  // Quest
  public get quest() {
    const storeState = this.store.getState();
    const quest = storeState.quests.find(q => q.name === this.questName);
    if (!quest) throw new Error("No quest :(")
    return quest;
  }

  protected get questVars(): TQuestVars {
    return this.quest.questVars as unknown as TQuestVars;
  }

  protected get spritesheetPaths(): string[] {
    const adventurers = this.getAdventurers();
    return [
      ...adventurers.map(a => a.spritesheetPath),
      `${spritesheetBasePath}troll-sword.json`,   // todo: only load enemy sprites that are actually needed
      `${spritesheetBasePath}troll-axe.json`      // todo: only load enemy sprites that are actually needed
    ];
  }

  public get settings() {
    return this.store.getState().settings;
  }

  // Provide questvars to update
  protected updateQuestVars(updated: DeepPartial<TQuestVars>) {
    this.dispatch(updateQuestVars(this.questName, updated));
  }

  public getAdventurers(): AdventurerStoreState[] {
    const storeState = this.store.getState();
    return adventurersOnQuest(storeState.adventurers, this.quest);
  }

  protected getAdventurerByActor(actor: ActorObject) {
    const storeState = this.store.getState();
    return storeState.adventurers.find(a => a.id === actor.name);
  }
  protected getEnemyByActor(actor: ActorObject) {
    return getEnemyDefinition(actor.name);
  }

  protected getAdventurerById(id: string) {
    const storeState = this.store.getState();
    return storeState.adventurers.find(a => a.id === id);
  }

  protected getActorSkills(actor: ActorObject) {
    if (isAdventurer(actor)) {
      const adventurer = this.getAdventurerByActor(actor);
      if (!adventurer) throw new Error("No adventurer found")
      return adventurer.skills;
    }
    const enemy = this.getEnemyByActor(actor);
    return enemy.skills;
  }

  protected getActorMainhandItem(actor: ActorObject) {
    if (isAdventurer(actor)) {
      const adventurer = this.getAdventurerByActor(actor);
      if (!adventurer) throw new Error("No adventurer found")
      return adventurer.equipment[EquipmentSlotType.mainHand];
    }
    const enemy = this.getEnemyByActor(actor);
    return enemy.mainHand;
  }

  protected getActorOffhandItem(actor: ActorObject) {
    if (isAdventurer(actor)) {
      const adventurer = this.getAdventurerByActor(actor);
      if (!adventurer) throw new Error("No adventurer found")
      return adventurer.equipment[EquipmentSlotType.offHand];
    }
    const enemy = this.getEnemyByActor(actor);
    return enemy.offHand;
  }

  protected questUpdate(input: string | TextEntry, icon?: string, toast = false) : void {
    const textEntry: TextEntry = isTextEntry(input) ? input : {key: input};
    const title = TextManager.getTextEntry(textEntry);
    if (toast) {
      ToastManager.addToast(title, Type.questUpdate, icon, getQuestLink(this.questName));
    }
    this.log(textEntry);
  }

  protected log(input: string | TextEntry) : void {
    const textEntry: TextEntry = isTextEntry(input) ? input : {key: input};
    this.dispatch(addLogEntry(textEntry, LogChannel.quest, this.questName));
  }

  // Store
  protected dispatch(action: AnyAction) {
    this.store.dispatch(action)
  }
}

export interface Situation {
  title: string;
  choices?: string[];
  text?: string;
}

// This is the format AStarFind works with
const convertIn = (l: [number, number]) => ({ x: l[0], y: l[1] });
const convertOut = (input: number[]): [number, number] => [input[0], input[1]];

