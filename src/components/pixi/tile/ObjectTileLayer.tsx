import { PixiComponent } from "@inlet/react-pixi";
import * as PIXI  from 'pixi.js';
import { TiledTilesetData } from 'constants/tiledMapData';
import { SceneObject } from 'stores/scene';

window.PIXI = PIXI;
// eslint-disable-next-line import/first
import 'pixi-tilemap';


interface Props  {
    texture: PIXI.Texture;
    objects: SceneObject[];
    tileset: TiledTilesetData;
    spritesheet: PIXI.Spritesheet;
};

// unused at the moment
const ObjectTileLayer = PixiComponent<Props, any>("ObjectTileLayer", {
    create(props: Props) {
        // @ts-ignore
        const tileLayer = new window.PIXI.tilemap.CompositeRectTileLayer(0, [props.texture]);
        return tileLayer;
    },

    applyProps(instance, oldProps: Props, props: Props) {
        const {objects, tileset, spritesheet} = props;
        instance.clear();
        if (!objects) return;

        objects.forEach((object) => {
            const w = tileset.tilewidth;
            const h = tileset.tileheight;
            const x = object.location[0] * w;
            const y = object.location[1] * h;

            if (object.gid !== undefined) {
                const spriteId = `${tileset.name}-${(object).gid}`;
                instance.addFrame(spritesheet.textures[spriteId], x, y);
            }
        });
    }
});

export default ObjectTileLayer;

