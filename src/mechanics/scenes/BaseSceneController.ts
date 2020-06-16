import { Store, AnyAction } from "redux";
import { getExtendedTilemapObjects, ExtendedTiledObjectData, addAllTilesInLayerToList } from 'utils/tilemap';
import { adventurersOnQuest } from 'storeHelpers';
import { StoreState } from 'stores';
import { loadResource } from 'utils/pixiJs';
import { TiledMapData } from 'constants/tiledMapData';
import { AStarFinder } from 'astar-typescript';
import { AdventurerStoreState } from 'stores/adventurer';
import { setScene, setSceneName } from 'actions/quests';
import { SceneObject } from 'stores/scene';

export class BaseSceneController {
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
        const objects = this.createObjects();

        // todo: perhaps this should be a class such that stuff that repeats for every scene can be done in a base class
        const scene = {
            objects
        }
        this.store.dispatch(setScene(this.questName, scene));
    }

    actorMoved(actor: string, location: [number, number]) {
        const object = this.tilemapObjects![`${location[0]},${location[1]}`];
        if (!object) return;

        if (object.ezProps?.loadScene) {
            this.store.dispatch(setSceneName(this.questName, object.ezProps.loadScene))
        }
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
        return this.blockedTiles.some((l) => l[0] === location[0] && l[1] === location[1]);
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

    protected createObjects() {
        return [
            ...this.createActors(),
            ...this.createTileobjects()
        ]
    }

    protected createActors(): SceneObject[] {

        if (!this.tilemapObjects) {
            throw new Error("No tilemapObjects");
        }

        const storeState = this.store.getState();
        const quest = storeState.quests.find(q => q.name === this.questName)!;
        const adventurers = adventurersOnQuest(storeState.adventurers, quest);

        const startLocations = Object.values(this.tilemapObjects)
            .filter(o => o.type === "adventurerStart")
            .map(o => o.location);
        if (adventurers.length > startLocations.length) {
            throw new Error("Not enough objects with 'adventurerStart' property set to true");
        }
        return adventurers.reduce((acc: SceneObject[], value: AdventurerStoreState, index: number) => {
            const location = startLocations[index];
            acc.push({
                type: "actor",
                health: 100,
                location,
                name: value.id,
            })
            return acc;
        }, []);
    }

    protected createTileobjects(): SceneObject[] {
        if (!this.tilemapObjects) {
            throw new Error("No tilemapObjects");
        }

        return Object.values(this.tilemapObjects)
            .filter(o => o.type === "tileobject")
            .map(o => ({
                gid: o.gid!,
                location: o.location,
                name: o.name,
                type: "tileobject",
            }));
    }   
        
}
