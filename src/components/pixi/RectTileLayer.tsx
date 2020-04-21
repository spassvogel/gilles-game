import { PixiComponent } from "@inlet/react-pixi";
import * as PIXI  from 'pixi.js';
import { TiledLayerData, TiledTilesetData } from 'constants/tiledMapData';

window.PIXI = PIXI;
// eslint-disable-next-line import/first
import 'pixi-tilemap';


interface Props  {
    texture: PIXI.Texture;
    horizontalTiles: number;
    layer: TiledLayerData;
    tileset: TiledTilesetData;
    spritesheet: PIXI.Spritesheet;
};

const RectTileLayer = PixiComponent<Props, any>("RectTileLayer", {
    create(props: Props) {
        var tileLayer = new window.PIXI.tilemap.CompositeRectTileLayer(0, [props.texture]);
        return tileLayer;
    },

    applyProps(instance, oldProps: Props, props: Props) {
        const {layer, tileset, horizontalTiles,spritesheet} = props;
        if (!layer.data) {
            return;
        }
        for (let i = 0; i < layer.data.length; i++) {
            const w = tileset.tilewidth;
            const h = tileset.tileheight;
            const x = (i % horizontalTiles) * w;
            const y = Math.floor(i / horizontalTiles) * h;
        
            const spriteId = layer.data[i];
        
            if (spriteId > 0) {
                instance.addFrame(spritesheet.textures[spriteId], x, y);
            }
        }
    }
});

export default RectTileLayer;

