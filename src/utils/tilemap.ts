import { TiledProperty, TiledLayerData, TiledTilesetData } from 'constants/tiledMapData';


// Unpack array of properties into key/value object for fast retrieval
export const parseProperties = (properties?: TiledProperty[]): {[key: string]: string | boolean | number } => {
    if (!properties) return {};
    return properties.reduce((acc: {[key: string]: string | boolean | number}, value: TiledProperty) => {
        acc[value.name] = value.value;
        return acc;
    }, {});
}

export enum TiledObjectType {
    adventurerStart = "adventurerStart",
    exit = "exit",
    actor = "actor",
    enemySpawn = "enemySpawn",
}

// finds tileset based on gid
export const findTileset = (gid: number, tilesets: TiledTilesetData[]): TiledTilesetData | undefined => {
    let tileset;
    for (let i = tilesets.length - 1; i >= 0; i--) {
        tileset = tilesets[i];
        if (tileset.firstgid <= gid) {
            break;
        }
    }
    return tileset;
}
/** Add tiles in this layer to list */
export const addAllTilesInLayerToList = (list: [number, number][], layer: TiledLayerData, columns: number): void => {
    layer.data.reduce((acc: [number, number][], tile, index) => {
        if (tile > 0) {
            const x = (index % columns);
            const y = Math.floor(index / columns);
            acc.push([x, y]);
        }
        return acc;
    }, list);
}

export const locationEquals = (a: [number, number], b: [number, number]): boolean => {
    return a[0] === b[0] && a[1] === b[1];
}