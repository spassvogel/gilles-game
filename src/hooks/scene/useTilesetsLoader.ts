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

/**
 * @param basePath
 * @returns
 */
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
    // todo: first add then load in parallel
    // use own laoder. see usetileset
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
  }, [data, tileSpritesheets]);

  const loadComplete = !!data && nextTilesetToload(data, tileSpritesheets) === undefined;

  return {
    loadComplete,
    loadTilesets,
    tileSpritesheets,
  };
};

export default useTilesetsLoader;


// import { useState, useEffect } from 'react';
// import { loadResource } from 'utils/pixiJs';
// import { TiledMapData, TiledTilesetData } from 'constants/tiledMapData';
// import { SpritesheetData, SpriteData } from 'constants/spritesheetData';
// import { Loader, Spritesheet } from 'pixi.js';
// import { basePath } from 'mechanics/scenes/useSceneController';

// const parseSpritesheetData = (tileset: TiledTilesetData): SpritesheetData => {
//   const columns = tileset.columns;

//   const frames: { [name: string]: SpriteData } = {};
//   for (let i = 0; i < tileset.tilecount; i++) {
//     const w = tileset.tilewidth;
//     const h = tileset.tileheight;
//     const x = (i % columns) * w;
//     const y = Math.floor(i / columns) * h;

//     frames[`${tileset.name}-${i + tileset.firstgid}`] = {
//       frame: { x, y, w, h },
//       spriteSourceSize: { x, y, w, h },
//       rotated: false,
//       trimmed: false,
//       sourceSize: { w, h },
//     };
//   }
//   const image = tileset.image;
//   const size = { w: tileset.imagewidth, h: tileset.imageheight };
//   return {
//     frames,
//     meta: {
//       image,
//       size,
//       scale: '1',
//     },
//   };
// };

// const tilesetToImagePath = (tileset: TiledTilesetData) => (`${basePath}${tileset.image.substring(tileset.image.indexOf('/'))}`);

// /**
//  * @param basePath
//  * @returns
//  */
// const useTilesetsLoader = (mapData?: TiledMapData) => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [spritesheets, setSpritesheets] = useState<{ [key: string]: Spritesheet }>();

//   useEffect(() => {
//     setLoading(true);
//     if (!mapData) return;

//     const loader = new Loader();
//     mapData.tilesets.forEach(ts => {
//       const image = tilesetToImagePath(ts);
//       loader.add(ts.name, `${basePath}${image}`);
//     });
//     loader.load(() => {
//       const newSpritesheets = mapData?.tilesets.reduce<{ [key: string]: Spritesheet }>((acc, tileset) => {
//         const resource = loader.resources[tileset.name];
// console.log('resource', resource)
//         if (!resource.texture) throw new Error(`No texure found ${tileset.name} (${tilesetToImagePath(tileset)})`);
//         const spritesheetData = parseSpritesheetData(tileset);
//         const spritesheet = new Spritesheet(resource.texture, spritesheetData);

//         acc[tileset.name] = spritesheet;
//         return acc;
//       }, {});
// console.log('newSpritesheets', newSpritesheets)
//       setSpritesheets(newSpritesheets);
//       setLoading(false);
//     });
//   }, [mapData]);

//   return {
//     loading,
//     spritesheets,
//   };
// };

// export default useTilesetsLoader;
