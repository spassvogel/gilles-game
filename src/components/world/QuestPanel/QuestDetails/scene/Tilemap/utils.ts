import { TiledLayerData } from 'constants/tiledMapData';
import { SceneObject } from 'store/types/scene';

export const getLayerObjects = (objects: SceneObject[], layer: TiledLayerData) => {
  return objects.reduce<{ tileObjects: SceneObject[], spriteObjects: SceneObject[] }>((acc, value) => {
    if (value.layerId === layer.id) {
      if (value.gid !== undefined) {
        acc.tileObjects.push(value);
      } else if (value.properties.isSprite === true) {
        acc.spriteObjects.push(value);
      }
    }
    return acc;
  }, { tileObjects: [], spriteObjects: [] });
};
