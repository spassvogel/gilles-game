import { useState, useEffect } from 'react';
import { loadResource } from 'utils/pixiJs';
import { TiledTilesetData } from 'constants/tiledMapData';
import { SpritesheetData, SpriteData } from 'constants/spritesheetData';
import { Spritesheet } from 'pixi.js';

// Returns a TiledTilesetData that has not been loaded into tilesetsTextures yet
const nextTilesetToload = (tilesets: TiledTilesetData[], tilesetsTextures: { [key: string]: Spritesheet }) => {
  return tilesets.find((t) => {
    return !tilesetsTextures[t.name];
  });
};


const parseSpritesheetData = (tileset: TiledTilesetData): SpritesheetData => {
  const columns = tileset.columns;

  const frames: { [name: string]: SpriteData } = {};
  for (let i = 0; i < tileset.tilecount; i++) {
    const w = tileset.tilewidth;
    const h = tileset.tileheight;
    const x = (i % columns) * w;
    const y = Math.floor(i / columns) * h;

    frames[`${tileset.name}-${i + tileset.firstgid}`] = {
      frame: { x, y, w, h },
      spriteSourceSize: { x, y, w, h },
      rotated: false,
      trimmed: false,
      sourceSize: { w, h },
    };
  }
  const image = tileset.image;
  const size = { w: tileset.imagewidth, h: tileset.imageheight };
  return {
    frames,
    meta: {
      image,
      size,
      scale: '1',
    },
  };
};

const useTilesetsLoader = (basePath: string) => {
  const [tileSpritesheets, setTilesets] = useState<{ [key: string]: Spritesheet }>({});
  const [data, setData] = useState<TiledTilesetData[]>();

  const loadTilesets = (value: TiledTilesetData[]) => {
    setData(value);
  };

  useEffect(() => {
    if (!data) return;
    const nextTileset = nextTilesetToload(data, tileSpritesheets);
    if (!nextTileset) return;

    const tilesetName = nextTileset.name;
    const image = nextTileset.image.substring(nextTileset.image.indexOf('/'));
    loadResource(`${basePath}/${image}`, (resource) => {
      if (!resource) return;
      if (resource.error) {
        throw new Error(`Loading ${basePath}/${image}\n${resource.error}`);
      }

      const spritesheetData = parseSpritesheetData(nextTileset);
      if (!resource.texture) throw new Error(`No texure found ${basePath}/${image}`);
      const spritesheet = new Spritesheet(resource.texture, spritesheetData);

      spritesheet.parse(() => {
        const newTilesets = {
          ...tileSpritesheets,
          [tilesetName]: spritesheet,
        };
        setTilesets(newTilesets);
      });
    });
  }, [data, basePath, tileSpritesheets]);

  const loadComplete = !!data && nextTilesetToload(data, tileSpritesheets) === undefined;

  return {
    loadComplete,
    loadTilesets,
    tileSpritesheets,
  };
};

export default useTilesetsLoader;
