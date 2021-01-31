import { Store, AnyAction } from "redux";
import { addAllTilesInLayerToList, locationEquals, TiledObjectType, parseProperties } from 'utils/tilemap';
import { StoreState } from 'store/types';
import { loadResourceAsync } from 'utils/pixiJs';
import { TiledLayerType, TiledMapData, TiledObjectData } from 'constants/tiledMapData';
import { AStarFinder } from 'astar-typescript';
import { AdventurerStoreState } from 'store/types/adventurer';
import { setScene, setSceneName, exitEncounter, enqueueSceneAction, updateQuestVars } from 'store/actions/quests';
import { SceneObject, ActorObject, LootCache, SceneActionType, SceneAction, isActorObject, getSpritesheetPaths } from 'store/types/scene';
import { ToastManager } from 'global/ToastManager';
import { Type } from 'components/ui/toasts/Toast';
import { getQuestLink } from 'utils/routing';
import { TextEntry, isTextEntry } from 'constants/text';
import { TextManager } from 'global/TextManager';
import { addLogText, addLogEntry } from 'store/actions/log';
import { getDefinition } from 'definitions/quests';
import { LogChannel } from 'store/types/logEntry';
import { addGold } from 'store/actions/gold';
import { addItemToInventory, removeItemFromInventory } from 'store/actions/adventurers';
import { adventurersOnQuest } from 'store/helpers/storeHelpers';
import { GameSound, SoundManager } from 'global/SoundManager';
import { Allegiance } from "store/types/combat";
import { PartialDeep } from "type-fest";
import { Item } from "definitions/items/types";

const spritesheetBasePath = "img/scene/actors/";
const movementDuration = 500; // time every tile movement takes

/**
 * This is a type of God class that knows pretty much everything about a scene
 */
export class BaseSceneController<TQuestVars> {

    public questName: string;
    public mapData?: TiledMapData;
    public aStar?: AStarFinder;
    public dataLoading: boolean = false;
    public dataLoadComplete: boolean = false;

    protected jsonPath?: string;
    protected store: Store<StoreState, AnyAction>;
    protected blockedTiles: [number, number][] = [];

    constructor(store: Store<StoreState, AnyAction>, questName: string) {
        this.store = store;
        this.questName = questName;
    }

    get basePath(): string | null {
        if (!this.jsonPath) return null;
        return `${process.env.PUBLIC_URL}/${this.jsonPath.substr(0, this.jsonPath.lastIndexOf('/'))}`;
    }


    // Loads tiles from json, loads all scene assets
    loadData(callback: () => void) {
        if (this.dataLoadComplete) {
            return callback();
        }
        if (!this.jsonPath) {
            throw new Error("No jsonPath defined!");
        }
        this.dataLoading = true;
        // load sounds
        const loadSound = async (sound: GameSound, files: string[]): Promise<PIXI.sound.Sound[]> => {
            return new Promise((resolve, reject) => {
                SoundManager.addSound(sound, files, (sounds) => {
                    resolve(sounds);
                })
            });
        }
        const promises = [
            loadSound("scene/bow", ["sound/scene/bow-01.mp3", "sound/scene/bow-02.mp3"]),
            loadSound("scene/meleeHit", ["sound/scene/melee-hit-01.mp3", "sound/scene/melee-hit-02.mp3", "sound/scene/melee-hit-03.mp3"]),
            loadSound("scene/metalBash", ["sound/scene/metal-bash-01.mp3", "sound/scene/metal-bash-02.mp3", "sound/scene/metal-bash-03.mp3"]),
            loadSound("scene/shieldBash", ["sound/scene/shield-bash-impact.mp3"]),
            loadSound("scene/swish", ["sound/scene/swish-01.mp3", "sound/scene/swish-02.mp3", "sound/scene/swish-03.mp3", "sound/scene/swish-04.mp3"]),
            loadSound("scene/doorOpen", ["sound/scene/door-open.mp3"]),
            loadResourceAsync(`${process.env.PUBLIC_URL}/${this.jsonPath}`)
        ] as const;

        Promise.all(promises).then(async () => {
            const resource = PIXI.Loader.shared.resources[`${process.env.PUBLIC_URL}/${this.jsonPath}`];
            this.mapData = resource.data;

            // In the case a scene is just created, we dont have this.sceneObjects yet
            const spritesheets = getSpritesheetPaths(this.sceneObjects.length ? this.sceneObjects : this.createObjects());
            for(const path of spritesheets) {
                await loadResourceAsync(path);
            }
            // PIXI.utils.clearTextureCache()
            this.dataLoadComplete = true;
            this.dataLoading = false;
            callback();
        });
    }

    createBlockedTiles(objects: SceneObject[]) {
        this.blockedTiles = [];
        if(this.mapData) {
            this.mapData.layers.filter(layer => layer.visible).forEach(layer => {
                if (layer.properties && layer.properties.some(p => p.name === 'blocksMovement' && p.value === true)){
                    addAllTilesInLayerToList(this.blockedTiles, layer, layer.width);
                }
            });
        }
        objects.forEach(o => {
            if(o.properties.blocksMovement === true && o.location){
                this.blockedTiles.push(o.location);
            }
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
            combat
        }
        this.dispatch(setScene(this.questName, scene));

        this.createBlockedTiles(objects);
        // Create aStar based on blocked tiles
        if (this.mapData) {
            this.aStar = this.createAStar();
        }
    }

    sceneEntered() {
        // tslint:disable-next-line: no-empty
    }

    // Convenience function returns an object with tileWidth and tileHeight properties
    getTileDimensions() {
        return {
            tileWidth: this.mapData?.tilewidth || 0,
            tileHeight: this.mapData?.tileheight || 0
        }
    }

    actorMoved(actor: string, location: [number, number]) {
        // const object = this.tilemapObjects![`${location[0]},${location[1]}`];
        const destination = this.getObjectAtLocation(location);
        if (!destination) return;

        if (destination.type === TiledObjectType.exit) {
            // We've hit the exit. Should we load another scene?
            if (destination.properties.loadScene) {
                this.dispatch(setSceneName(this.questName, destination.properties.loadScene))
            } else {
                // Or exit the encounter
                const index = Math.floor(this.quest.progress) + 1;
                const definition = getDefinition(this.questName);
                const node = definition.nodes[index];
                if (node.log) {
                    // If the next node has a log entry, add it
                    this.dispatch(addLogText(node.log, null, LogChannel.quest, this.questName));
                }
                this.dispatch(exitEncounter(this.questName));
            }
        }
    }

    actorInteract(actorId: string, location: [number, number]) {
        const actor = this.getSceneActor(actorId);
        const object = this.getObjectAtLocation(location);

        if (!object) {
            // tslint:disable-next-line: no-console
            console.warn("No object found");
            return;
        }

        this.interactWithObject(actor, object);
    }

    actorAttemptAction(actorId: string, type: SceneActionType, destination: [number, number]) {
        // Tries to perform action on given actor

        const actor = this.getSceneActor(actorId);
        const {location} = actor;

        switch (type) {
            case SceneActionType.move: {
                // Find path to move using aStar
                const path = this.findPath(location!, destination);

                if (this.combat) {
                    const remaining = actor.ap || -1;
                    if (remaining < (path?.length || 0)) {
                        // return;
                    }
                    // this.dispatch(deductActorAp(this.questName, actorId, path?.length || 0));
                }

                path?.forEach((l, index) => {
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
                const path = this.findPathNearest(location!, destination);
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
                const path = this.findPath(location!, destination);
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
                // this.dispatch(deductActorAp(this.questName, actorId, path?.length || 0));
            }
        }
    }

    interactWithObject(_actor: ActorObject, _object: SceneObject) {
        // override
    }

    // Converts pixel coordinate to scene location
    pointToSceneLocation (point: PIXI.Point): [number, number] {
        if (!this.mapData?.tilewidth || !this.mapData?.tileheight) {
            return [0, 0];
        }
        return [Math.floor(point.x / this.mapData.tilewidth), Math.floor(point.y / this.mapData.tilewidth)];
    }

    // Returns true if the tile is blocked
    locationIsBlocked(location: [number, number]){
        return this.blockedTiles.some((l) => locationEquals(l, location));
    }

    // Returns true
    locationIsOutOfBounds(location: [number, number]){
        return location[0] < 0 || location[1] < 0 ||
            location[0] >= this.mapData!.width ||
            location[1] >= this.mapData!.height;
    }

    // Should be overridden
    getLootCache(name: string): LootCache | undefined {
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

    getSituation(situation: string, adventurerId?: string) : Situation | undefined {
         return undefined;
    }

    handleSituationOptionClick(situation: string, option: string, adventurerId: string) {
        // @ts-ignore
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
    public findPathNearest(origin: [number, number], target: [number, number], includeLast: boolean = false) {
        // todo; shortcut, if already neighbour, return early
        const grid = this.aStar?.getGridClone();
        if (!grid) return [];
        const matrix = grid.map(r => r.map(c => (c.getIsWalkable() ? 0 : 1)));
        matrix[target[0]][target[1]] = 0; // make target pathable
        const tempAStar = new AStarFinder({
            grid: {
                matrix
            },
            includeStartNode: false,
            heuristic: "Manhattan",
            weight: 0.2,
        });
        return tempAStar.findPath
            (convertIn(origin), convertIn(target))
            .map(convertOut)
            .slice(0, includeLast ? undefined : -1);
    }

    /**
     * Calculates the AP costs to walk
     */
    calculateWalkApCosts(from: [number, number], to: [number, number]) {
        return this.findPath(from, to)?.length || 0;
    }

    public getSceneActor(actorId: string): ActorObject {
        return this.sceneActors.find(sA => sA.name === actorId)!;
    }

    public getObjectAtLocation(location: [number, number]) {
        return this.quest.scene?.objects?.find(o => o.location && locationEquals(o.location, location))
    }

    protected createAStar() {
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
        const adventurers = this.getAdventurers();
        objectLayers.forEach(objectLayer => {
            objectLayer.objects.reduce((acc:  SceneObject[], value: TiledObjectData) => {

                // reduce the props array into an object with key/values
                const properties = parseProperties(value.properties);
                const location: [number, number] = [
                    value.x / (this.mapData?.tilewidth || 1),
                    (value.y - (value.gid ? value.height : 0)) / (this.mapData?.tileheight || 1)
                ];

                let object: SceneObject | null = {
                    ...value,
                    layerId: objectLayer.id,
                    properties,
                    location
                };

                if (object.type === TiledObjectType.adventurerStart) {
                    const adventurer = adventurers.pop();
                    if (adventurer) {
                        object.type = TiledObjectType.actor;
                        if (isActorObject(object)) { // typeguard, is always true but we need to tell typescript it's an actor
                            object.name = adventurer.id;
                            object.allegiance = Allegiance.player;
                            object.properties.adventurerId = adventurer.id;
                            object.properties.isSprite = true;
                            object.properties.spritesheet = adventurer.spritesheetPath;
                        }
                    } else {
                        // Unused player spawn location, dont add
                        object = null;
                    }
                } else if (object.type === TiledObjectType.enemySpawn) {
                    object.type = TiledObjectType.actor;
                    if (isActorObject(object)) { // typeguard, is always true but we need to tell typescript it's an actor
                        object.allegiance = Allegiance.enemy;
                        object.properties.isSprite = true;
                        object.properties.spritesheet = `${spritesheetBasePath}troll-sword.json`;
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

    // Quest
    protected get quest() {
        const storeState = this.store.getState();
        return storeState.quests.find(q => q.name === this.questName)!;
    }

    protected get questVars(): TQuestVars {
        return this.quest.questVars;
    }

    // Provide questvars to update
    protected updateQuestVars(updated: PartialDeep<TQuestVars>) {
        this.dispatch(updateQuestVars(this.questName, updated));
    }

    protected getAdventurers(): AdventurerStoreState[] {
        const storeState = this.store.getState();
        return adventurersOnQuest(storeState.adventurers, this.quest);
    }

    protected getAdventurerByActor(actor: ActorObject) {
        const storeState = this.store.getState();
        return storeState.adventurers.find(a => a.id === actor.name);
    }

    protected getAdventurerById(id: string) {
        const storeState = this.store.getState();
        return storeState.adventurers.find(a => a.id === id);
    }

    protected questUpdate(input: string | TextEntry, icon?: string, toast: boolean = false) : void {
        const textEntry: TextEntry = isTextEntry(input) ? input : {key: input};
        const title = TextManager.getTextEntry(textEntry);
        if (toast) {
            ToastManager.addToast(title, Type.questUpdate, icon, getQuestLink(this.questName));
        }
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
