import { PixiComponent } from "@inlet/react-pixi";
import * as PIXI from 'pixi.js';
import { TiledTilesetData } from 'constants/tiledMapData';
import { SceneObject } from 'store/types/scene';
import { findTileset } from "utils/tilemap";
import { CompositeRectTileLayer } from "@pixi/tilemap";

interface Props  {
  objects: SceneObject[];
  tilesets: TiledTilesetData[];
  spritesheets: {[key: string]: PIXI.Spritesheet}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any 
const ObjectTileLayer = PixiComponent<Props, any>("ObjectTileLayer", {
  create(_props: Props) {
    const tileLayer = new CompositeRectTileLayer();
    return tileLayer;
  },

  applyProps(instance, _oldProps: Props, props: Props) {
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
      const spriteId = `${tileset.name}-${object.gid}`;
      instance.addFrame(spritesheet.textures[spriteId], x, y);
    
    });
  }
});

export default ObjectTileLayer;

