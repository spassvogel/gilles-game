import { Store, AnyAction } from "redux";
import { getExtendedTilemapObjects, ExtendedTiledObjectData, addAllTilesInLayerToList, locationEquals, TiledObjectType } from 'utils/tilemap';
import { StoreState } from 'store/types';
import { loadResourceAsync } from 'utils/pixiJs';
import { TiledMapData } from 'constants/tiledMapData';
import { AStarFinder } from 'astar-typescript';
import { AdventurerStoreState } from 'store/types/adventurer';
import { setScene, setSceneName, exitEncounter, enqueueSceneAction } from 'store/actions/quests';
import { SceneObject, ActorObject, LootCache, SceneActionType, SceneAction } from 'store/types/scene';
import { ToastManager } from 'global/ToastManager';
import { Type } from 'components/ui/toasts/Toast';
import { getQuestLink } from 'utils/routing';
import { TextEntry, isTextEntry } from 'constants/text';
import { TextManager } from 'global/TextManager';
import { addLogText, addLogEntry } from 'store/actions/log';
import { getDefinition } from 'definitions/quests';
import { LogChannel } from 'store/types/logEntry';
import { addGold } from 'store/actions/gold';
import { addItemToInventory } from 'store/actions/adventurers';
import { calculateInitialAp } from './actionPoints';
import { adventurersOnQuest } from 'store/helpers/storeHelpers';
import { Sound, SoundManager } from 'global/SoundManager';

/**
 * This is a type of God class that knows pretty much everything about a scene
 */
export class BaseSceneController<TQuestVars> {

    public mapData?: TiledMapData;
    public aStar?: AStarFinder;
    public questName: string;
    public tilemapObjects?: {[location: string]: ExtendedTiledObjectData};

    protected jsonPath?: string;
    protected store: Store<StoreState, AnyAction>;
    protected blockedTiles: [number, number][] = [];

    protected spritesheetsMap: {[key: string]: PIXI.Spritesheet} = {} // Various spritesheets, e.g for actors

    constructor(store: Store<StoreState, AnyAction>, questName: string) {
        this.store = store;
        this.questName = questName;
    }

    get basePath(): string | null {
        if (!this.jsonPath) return null;
        return `${process.env.PUBLIC_URL}/${this.jsonPath.substr(0, this.jsonPath.lastIndexOf('/'))}`;
    }

    get dataLoaded(): boolean {
        return !!this.mapData;
    }

    // Loads tiles from json, loads all scene assets
    loadData(callback: () => void) {
        if (this.dataLoaded) {
            return callback();
        }
        if (!this.jsonPath) {
            throw new Error("No jsonPath defined!");
        }

        // load sounds
        const loadSound = async (sound: Sound, files: string[]): Promise<PIXI.sound.Sound[]> => {
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
            loadResourceAsync(`${process.env.PUBLIC_URL}/${this.jsonPath}`)
        ] as const;

        Promise.all(promises).then(async () => {
            const resource = PIXI.Loader.shared.resources[`${process.env.PUBLIC_URL}/${this.jsonPath}`];
            this.mapData = resource.data;
            this.tilemapObjects = getExtendedTilemapObjects(resource.data);
            this.mapData!.layers.filter(layer => layer.visible).forEach(layer => {
                if (layer.properties && layer.properties.some(p => p.name === 'blocksMovement' && p.value === true)){
                    addAllTilesInLayerToList(this.blockedTiles, layer, layer.width);
                }
            });

            const adventurers = this.getAdventurers();
            const spritesheets = Array.from(new Set<string>(adventurers.map(a => a.spritesheetPath)));

            for(const path of spritesheets) {
                const {spritesheet} = await loadResourceAsync(path);
                this.spritesheetsMap[path] = spritesheet!;

                // Object.keys(spritesheet!.textures).forEach((key: string) => {
                //     Texture.removeFromCache(spritesheet!.textures[key]); //or just 'key' will work in that case
                // });
            }
            // PIXI.utils.clearTextureCache()
            // Create aStar based on blocked tiles
            this.aStar = this.createAStar();

            callback();
        });
    }

    // Constructs the scene and dispatches it to be saved to the store
    createScene() {
        const objects = this.createObjects();
        const actors = this.createActors();
        const combat = true;

        // todo: perhaps this should be a class such that stuff that repeats for every scene can be done in a base class
        const scene = {
            objects,
            actors,
            combat
        }
        this.store.dispatch(setScene(this.questName, scene));
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

    getActorSpritesheet(actorId: string): PIXI.Spritesheet {
        // todo: what about the non-adventurer actors (e.g the enemies)
        const path = this.getActorSpritesheetPath(actorId);
        return this.spritesheetsMap[path];
    }

    getActorSpritesheetPath(actorId: string): string {
        // todo: what about the non-adventurer actors (e.g the enemies)
        const adventurers = this.getAdventurers();
        const adventurer = adventurers.find(a => a.id === actorId)!;
        return adventurer.spritesheetPath;
    }

    actorMoved(actor: string, location: [number, number]) {
        const object = this.tilemapObjects![`${location[0]},${location[1]}`];
        if (!object) return;

        if (object.type === "exit") {
            // We've hit the exit. Should we load another scene?
            if (object.ezProps?.loadScene) {
                this.store.dispatch(setSceneName(this.questName, object.ezProps.loadScene))
            } else {
                // Or exit the encounter
                const index = Math.floor(this.quest.progress) + 1;
                const definition = getDefinition(this.questName);
                const node = definition.nodes[index];
                if (node.log) {
                    // If the next node has a log entry, add it
                    this.store.dispatch(addLogText(node.log, null, LogChannel.quest, this.questName));
                }
                this.store.dispatch(exitEncounter(this.questName));
            }
        }
    }

    actorCanInteract(actorId: string) {
        const {scene} = this.quest;
        const actor = scene?.actors.find(o => o.id === actorId)!;
        const object = this.tilemapObjects?.[`${actor.location[0]},${actor.location[1]}`];

        // todo: should we look for some specific property?
        return object && object.ezProps?.interactive;
    }

    actorInteract(actorId: string) {
        if (!this.actorCanInteract(actorId)) {
            // tslint:disable-next-line: no-console
            console.warn("Can't interact");
            return;
        }
        const {scene} = this.quest;
        const actor = scene?.actors.find(o => o.id === actorId)!;
        const object = scene?.objects
            .find(o => locationEquals(o.location, actor.location));

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

                const movementDuration = 500; // time every tile movement takes
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
            case SceneActionType.slash: {
                // Find path to move towards the target
                const path = this.findPath(location!, destination);
                const target = path?.pop();
                if (!path || !target) {
                    // No path possible.. cant do anything now
                    return;
                }

                // Walk towards the target
                const movementDuration = 500; // time every tile movement takes
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
            this.store.dispatch(addGold(lootCache.gold || 0));
        }
    }

    takeItemFromCache(itemIndex: number, name: string, adventurer: AdventurerStoreState, toSlot?: number) {
        // Override this to remove items from questvars
        const lootCache = this.getLootCache(name);
        if (!lootCache) return;

        const item = lootCache.items[itemIndex];
        this.store.dispatch(addItemToInventory(adventurer.id, item, toSlot))
    }

    getSituation(situation: string, adventurerId?: string) : { title: string, choices: string[]} | undefined {
         return undefined;
    }

    handleSituationOptionClick(situation: string, option: string) {
        // @ts-ignore
    }

    /**
     * Returns a path from two locations on the map
     * @param origin
     * @param target
     */
    findPath(origin: [number, number], target: [number, number]) {
        // This is the format AStarFind works with
        const convertIn = (l: [number, number]) => ({ x: l[0], y: l[1] });
        const convertOut = (input: number[]): [number, number] => [input[0], input[1]];

        return this
            .aStar?.findPath(convertIn(origin), convertIn(target))
            .map(convertOut);
    }

    /**
     * Calculates the AP costs to walk
     */
    calculateWalkApCosts(from: [number, number], to: [number, number]) {
        return this.findPath(from, to)?.length || 0;
    }

    getActorByAdventurerId(adventurerId: string) {
        const { scene } = this.quest;
        return scene?.actors.find(a => a.id === adventurerId);
    }

    protected createAStar() {
        const matrix: number[][] = [];
        for (let y = 0; y < this.mapData!.height; y++) {
            const row: number[] = [];
            for (let x = 0; x < this.mapData!.width; x++) {
                const location: [number, number] = [x, y];
                const blocked = this.locationIsBlocked(location);
                row.push(blocked ? 1 : 0);
            }
            matrix.push(row);
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

    protected createActors(): ActorObject[] {

        // todo: add the baddies
        if (!this.tilemapObjects) {
            throw new Error("No tilemapObjects");
        }

        const adventurers = this.getAdventurers();

        const startLocations = Object.values(this.tilemapObjects)
            .filter(o => o.type === "adventurerStart")
            .map(o => o.location);
        if (adventurers.length > startLocations.length) {
            throw new Error("Not enough objects with 'adventurerStart' property set to true");
        }
        return adventurers.reduce((acc: ActorObject[], value: AdventurerStoreState, index: number) => {
            const location = startLocations[index];
            const ap = calculateInitialAp(value);
            acc.push({
                location,
                id: value.id,
                ap
            });
            return acc;
        }, []);
    }

    // These objects are saved in store
    protected createObjects(): SceneObject[] {
        if (!this.tilemapObjects) {
            throw new Error("No tilemapObjects");
        }

        return Object.values(this.tilemapObjects)
            .map(o => this.createObject(o))
            .filter((o): o is SceneObject => o !== null);   // filter out null values
    }

    protected createObject(config: ExtendedTiledObjectData): SceneObject | null {
        switch (config.type) {
            case TiledObjectType.adventurerStart:
            case TiledObjectType.exit:
                return null;
            default:
                return config;
        }
    }

    // protected createCaches(): { [name: string]: LootCache } {
    //     return Object.values(this.tilemapObjects!)
    //         .filter(o => o.type === "lootCache")
    //         .reduce((acc: { [name: string]: LootCache }, value) => {
    //             // serialize comma separated string to array of Item
    //             const items = value.ezProps?.items?.split(",").map((v:string) => {
    //                 const item = Item[v.trim()];
    //                 if (item) {
    //                     return item;
    //                 }
    //             }).filter(Boolean);
    //             acc[value.name] = {
    //                 title: value.ezProps?.title,
    //                 items
    //             }
    //             return acc;
    //         }, {});
    // }

    // Quest
    protected get quest() {
        const storeState = this.store.getState();
        return storeState.quests.find(q => q.name === this.questName)!;
    }

    protected get questVars(): TQuestVars {
        return this.quest.questVars;
    }

    // Scene
    protected get combat() {
        return !!this.quest.scene?.combat;
    }

    protected get sceneActors() {
        return this.quest.scene?.actors || [];
    }

    protected getSceneActor(actorId: string) {
        return this.sceneActors.find(sA => sA.id === actorId)!;
    }

    protected getAdventurers(): AdventurerStoreState[] {
        const storeState = this.store.getState();
        return adventurersOnQuest(storeState.adventurers, this.quest);
    }

    protected getAdventurerByActor(actor: ActorObject) {
        const storeState = this.store.getState();
        return storeState.adventurers.find(a => a.id === actor.id);
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
