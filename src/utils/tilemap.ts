import { TiledMapData, TiledObjectData, TiledLayerType, TiledProperty } from 'constants/tiledMapData';

/* Tiled doesnt export the tile location of an Object. This function calculates it based on x and y.
* Also returns a convenience object with all properties
*/
export const getExtendedTilemapObjects = (tilemapData: TiledMapData) => {
    const objectLayers = tilemapData.layers.filter(layer => layer.type === TiledLayerType.objectgroup);
    const objects: { [key: string]: TiledObjectData } = {};
    objectLayers.forEach(objectLayer => {    
        objectLayer.objects.reduce((acc: {[key: string]: ExtendedTiledObjectData}, value: TiledObjectData) => {
            const {x, y} = value;
            const location: [number, number] = [
                x / tilemapData.tilewidth, 
                y / tilemapData.tileheight - 1
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

export type ExtendedTiledObjectData = TiledObjectData | {
    location: [number, number];
    ezProps?: { [key: string]: any}
}