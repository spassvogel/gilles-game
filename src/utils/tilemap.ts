import { TiledMapData, TiledObjectData, TiledLayerType, TiledProperty, TiledLayerData } from 'constants/tiledMapData';

/* Tiled doesnt export the tile location of an Object. This function calculates it based on x and y.
* Also returns a convenience object with all properties
*/
export const getExtendedTilemapObjects = (tilemapData: TiledMapData) => {
    const objectLayers = tilemapData.layers.filter(layer => layer.type === TiledLayerType.objectgroup);
    const objects: { [key: string]: ExtendedTiledObjectData } = {};
    objectLayers.forEach(objectLayer => {
        objectLayer.objects.reduce((acc: {[location: string]: ExtendedTiledObjectData}, value: TiledObjectData) => {
            let {x, y} = value;
            if (value.gid !== undefined) {
                y -= value.height; // https://github.com/bjorn/tiled/issues/91
            }
            const location: [number, number] = [
                x / tilemapData.tilewidth,
                y / tilemapData.tileheight
            ];
            // reduce the props array into an object with key/values
            const ezProps = parseProperties(value.properties);
            const extended: ExtendedTiledObjectData = {
                location,
                ezProps,
                ...value
            };
            acc[`${location[0]},${location[1]}`] = extended; // todo: what if object alraedy exists at this location?
            return acc;
        }, objects);
    });
    return objects;
}

// Unpack array of properties into key/value object for fast retrieval
const parseProperties = (properties?: TiledProperty[]) => {
    if (!properties) return;
    return properties.reduce((acc: {[key: string]: any}, value: TiledProperty) => {
        acc[value.name] = value.value;
        return acc;
    }, {});
}

export type ExtendedTiledObjectData = TiledObjectData & {
    location: [number, number];
    ezProps?: { [key: string]: any}
}

/** Add tiles in this layer to list */
export const addAllTilesInLayerToList = (list: [number, number][], layer: TiledLayerData, columns: number) => {
    layer.data.reduce((acc: [number, number][], tile, index) => {
        if (tile > 0) {
            const x = (index % columns);
            const y = Math.floor(index / columns);
            acc.push([x, y]);
        }
        return acc;
    }, list);
}

export const locationEquals = (a: [number, number], b: [number, number]) => {
    return a[0] === b[0] && a[1] === b[1];
}