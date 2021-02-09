import { PixiComponent } from "@inlet/react-pixi";
import * as PIXI  from 'pixi.js';
import { TiledTilesetData } from 'constants/tiledMapData';
import { SceneObject } from 'store/types/scene';
import { CompositeRectTileLayer } from 'pixi-tilemap';
import { findTileset } from "utils/tilemap";

// window.PIXI = PIXI;
import 'pixi-tilemap';



interface Props  {
    objects: SceneObject[];
    tilesets: TiledTilesetData[];
    spritesheets: {[key: string]: PIXI.Spritesheet}
}

// unused at the moment
const ObjectTileLayer = PixiComponent<Props, any>("ObjectTileLayer", {
    create(_props: Props) {
        const tileLayer = new CompositeRectTileLayer();
        return tileLayer;
    },

    applyProps(instance, oldProps: Props, props: Props) {
        const {objects, tilesets, spritesheets} = props;
        if (!objects.length) {
            return;
        }
        instance.clear();
        if (!objects) return;

        objects.forEach((object) => {
            if (!object.gid) return; // todo!
            const tileset = findTileset(object.gid, tilesets);
            if (!tileset) return;

            const x = object.x;
            const y = object.y - tileset.tileheight;
            const spritesheet = spritesheets[tileset.name];

            // todo: add sprites!
            // if () {
                const spriteId = `${tileset.name}-${object.gid}`;
                instance.addFrame(spritesheet.textures[spriteId], x, y);
            // }
            // const w = tileset.tilewidth;
            // const h = tileset.tileheight;
            // // const x = object.location[0] * w;
            // // const y = object.location[1] * h;
            // const x = object.x;
            // const y = object.y;

            // if (object.gid !== undefined) {
            //     const spriteId = `${tileset.name}-${(object).gid}`;
            //     instance.addFrame(spritesheet.textures[spriteId], x, y);
            // }
        });
    }
});

export default ObjectTileLayer;

