import { useMemo } from 'react';
import { Loader, Texture } from 'pixi.js';
import { Orientation } from '.';
import { Animation } from './useAnimation';

// returns the frames used by the current animation
const useFrames = (spritesheetPath: string, animation: Animation, orientation: Orientation) => {
  const indexedFrames = useMemo(() => {
    if (!spritesheetPath) return;

    if (!Loader.shared.resources[spritesheetPath]?.textures){
      throw new Error(`No textures for ${spritesheetPath}`);
    }
    const allFrames = Object.keys(Loader.shared.resources[spritesheetPath].textures ?? {});
    return allFrames.reduce((acc: { [key: string]: Texture[] }, frame: string) => {
      // frames are in the format of: 'stand-n', 'walk0-ne', 'walk1-ne' etc
      // create a mapping with arrays keyed by the part without the number,
      // eg: 'stand-n': [TEXTURE:stand-n] and 'walk-ne': [TEXTURE:walk0-ne, TEXTURE:walk1-ne]
      const key = frame.replace(/[0-9]/g, '');
      if (!acc[key]) {
        acc[key] = [];
      }
      const texture = Loader.shared.resources[spritesheetPath].textures?.[frame];
      if (texture) acc[key].push(texture);
      return acc;
    }, {});
  }, [spritesheetPath]);

  return useMemo(() => {
    if (!indexedFrames) return;
    const spritesheet = Loader.shared.resources[spritesheetPath];

    const getFrames = () => {
      // Prefix all animations with the name of the image (without the extension) and a hyphen
      // So `orc-axe-walk0-n`, `skeleton-attack1-e`
      const prefix = `${spritesheet.data.meta.image.substring(0, spritesheet.data.meta.image.lastIndexOf('.'))}-`;
      switch (orientation) {
        case Orientation.northWest:
          return `${prefix}${animation}-${Orientation.northEast}`;
        case Orientation.west:
          return `${prefix}${animation}-${Orientation.east}`;
        case Orientation.southWest:
          return `${prefix}${animation}-${Orientation.southEast}`;
        default:
          return `${prefix}${animation}-${orientation}`;
      }
    };
    return indexedFrames[getFrames()];
  }, [animation, indexedFrames, orientation, spritesheetPath]);
};

export default useFrames;
