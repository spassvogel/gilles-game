import { PixiComponent } from "@inlet/react-pixi";
import * as PIXI  from 'pixi.js';
import { TiledLayerData, TiledTilesetData } from 'constants/tiledMapData';
import { CompositeRectTileLayer } from 'pixi-tilemap';
import { findTileset } from "utils/tilemap";


interface Props  {
    horizontalTiles: number;
    layer: TiledLayerData;
    tilesets: TiledTilesetData[];
    spritesheets: {[key: string]: PIXI.Spritesheet}
}

const RectTileLayer = PixiComponent<Props, any>("RectTileLayer", {
    create(props: Props) {
        // @ts-ignore
        const tileLayer = new CompositeRectTileLayer();
        return tileLayer;
    },

    applyProps(instance, oldProps: Props, props: Props) {
        const {layer, tilesets, horizontalTiles, spritesheets} = props;
        if (!layer.data) {
            return;
        }
        for (let i = 0; i < layer.data.length; i++) {
            const tileset = findTileset(layer.data[i], tilesets);
            if (!tileset) continue;

            const w = tileset.tilewidth;
            const h = tileset.tileheight;
            const x = (i % horizontalTiles) * w;
            const y = Math.floor(i / horizontalTiles) * h;
            const spritesheet = spritesheets[tileset.name];

            if (layer.data[i] > 0) {
                const spriteId = `${tileset.name}-${layer.data[i]}`;
                instance.addFrame(spritesheet.textures[spriteId], x, y);
            }
        }
    }
});

export default RectTileLayer;


