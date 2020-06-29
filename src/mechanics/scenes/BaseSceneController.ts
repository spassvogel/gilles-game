import { Store, AnyAction } from "redux";
import { getExtendedTilemapObjects, ExtendedTiledObjectData, addAllTilesInLayerToList, locationEquals } from 'utils/tilemap';
import { adventurersOnQuest } from 'storeHelpers';
import { StoreState } from 'stores';
import { loadResource } from 'utils/pixiJs';
import { TiledMapData } from 'constants/tiledMapData';
import { AStarFinder } from 'astar-typescript';
import { AdventurerStoreState } from 'stores/adventurer';
import { setScene, setSceneName, exitEncounter } from 'actions/quests';
import { TileObject, ActorObject, LootCache } from 'stores/scene';
import { ToastManager } from 'global/ToastManager';
import { Type } from 'components/ui/toasts/Toast';
import { getQuestLink } from 'utils/routing';
import { TextEntry } from 'constants/text';
import { TextManager } from 'global/TextManager';
import { addLogText, addLogEntry } from 'actions/log';
import { getDefinition } from 'definitions/quests';
import { LogChannel } from 'stores/logEntry';

export class BaseSceneController<TQuestVars> {
    public mapData?: TiledMapData;
    public aStar?: AStarFinder;
    public questName: string;
    public tilemapObjects?: {[key: string]: ExtendedTiledObjectData};

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

    get dataLoaded(): boolean {
        return !!this.mapData;
    }

    loadData(callback: () => void) {
        if (this.dataLoaded) {
            return callback();
        }
        if (!this.jsonPath) {
            throw new Error("No jsonPath defined!");
        }

        loadResource(`${process.env.PUBLIC_URL}/${this.jsonPath}`, (resource) => {
            this.mapData = resource.data;
            this.tilemapObjects = getExtendedTilemapObjects(resource.data);
            this.mapData!.layers.filter(layer => layer.visible).forEach(layer => {
                if (layer.properties && layer.properties.some(p => p.name === 'blocksMovement' && p.value === true)){
                    addAllTilesInLayerToList(this.blockedTiles, layer, layer.width);
                }
            });

            this.aStar = this.createAStar();

            callback();
        });
    }

    // Constructs the scene and dispatches it to be saved to the store
    createScene() {
        const tileObjects = this.createTileObjects();
        const actors = this.createActors();
        const caches = this.createCaches();

        // todo: perhaps this should be a class such that stuff that repeats for every scene can be done in a base class
        const scene = {
            tileObjects,
            actors,
            caches
        }
        this.store.dispatch(setScene(this.questName, scene));
    }

    // tslint:disable-next-line: no-empty
    sceneEntered() {
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
                const index = Math.floor(this.getQuest().progress) + 1;
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

    actorCanInteract(actorName: string) {
        const {scene} = this.getQuest();
        const actor = scene?.actors.find(o => o.name === actorName)!;
        const object = scene?.tileObjects
            .find(o => locationEquals(o.location, actor.location));

        // todo: should we look for some specific property?
        return !!object;
    }

    actorInteract(actorName: string) {
        if (!this.actorCanInteract(actorName)) {
            // tslint:disable-next-line: no-console
            console.warn("Can't interact");
            return;
        }
        const {scene} = this.getQuest();
        const actor = scene?.actors.find(o => o.name === actorName)!;
        const object = scene?.tileObjects
            .find(o => locationEquals(o.location, actor.location));

        if (!object || object.type !== "tileobject") {
            // tslint:disable-next-line: no-console
            console.warn("No object found");
            return;
        }

        this.interactWithObject(actor, object);
    }

    interactWithObject(_actor: ActorObject, _object: TileObject) {
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
            heuristic: "Manhatten",
            weight: 0,
        });
    }

    protected createActors(): ActorObject[] {

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
            acc.push({
                health: 100,
                location,
                name: value.id,
            })
            return acc;
        }, []);
    }

    protected createTileObjects(): TileObject[] {
        if (!this.tilemapObjects) {
            throw new Error("No tilemapObjects");
        }

        return Object.values(this.tilemapObjects)
            .filter(o => o.type === "tileobject")
            .map(o => ({
                id: o.id,
                gid: o.gid!,
                location: o.location,
                name: o.name,
                type: "tileobject",
            }));
    }

    protected createCaches(): { [key: string]: LootCache } {
        return {};
    }

    protected getQuest() {
        const storeState = this.store.getState();
        return storeState.quests.find(q => q.name === this.questName)!;
    }

    protected getQuestVars(): TQuestVars {
        return this.getQuest().questVars;
    }

    protected getAdventurers() {
        const storeState = this.store.getState();
        const quest = this.getQuest();
        return adventurersOnQuest(storeState.adventurers, quest);
    }

    protected getAdventurerByActor(actor: ActorObject) {
        const storeState = this.store.getState();
        return storeState.adventurers.find(a => a.id === actor.name);
    }

    protected questUpdate(textEntry: TextEntry, icon?: string) {
        const title = TextManager.getTextEntry(textEntry);
        ToastManager.addToast(title, Type.questUpdate, icon, getQuestLink(this.questName));
        this.store.dispatch(addLogEntry(textEntry, LogChannel.quest, this.questName));
    }
}
