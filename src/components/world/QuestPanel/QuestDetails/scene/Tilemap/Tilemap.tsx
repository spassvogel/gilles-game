import { Fragment, PropsWithChildren } from 'react';
import { TiledMapData, TiledLayerType } from 'constants/tiledMapData';
import { Container } from '@inlet/react-pixi';
import RectTileLayer from 'components/pixi/tile/RectTileLayer';
import * as PIXI from 'pixi.js';
import ObjectTileLayer from 'components/pixi/tile/ObjectTileLayer';
import { SceneObject } from 'store/types/scene';
import ObjectSpriteLayer from './ObjectSpriteLayer';
import { BaseSceneController } from 'mechanics/scenes/BaseSceneController';
import { Props as SceneProps } from '../Scene';
import { getLayerObjects } from './utils';
import SceneEffectLayer from './SceneEffectLayer';

interface Props extends SceneProps {
  basePath: string;
  data: TiledMapData;
  spritesheets: { [key: string]: PIXI.Spritesheet }
  objects: SceneObject[];
  controller: BaseSceneController<unknown>;
  selectedActorId: string;
}

const Tilemap = (props: PropsWithChildren<Props>) => {
  const { data, objects, controller, spritesheets, selectedActorId } = props;

  return (
    <Container >
      {data.layers
        .filter(l => l.visible)
        .map(layer => {
          if (layer.type === TiledLayerType.objectgroup) {
            const { tileObjects, spriteObjects } = getLayerObjects(objects, layer);
            return (
              <Fragment key={layer.name}>
                { !!tileObjects.length && (
                  <ObjectTileLayer
                    objects={tileObjects}
                    tilesets={data.tilesets || []}
                    spritesheets={spritesheets}
                  />
                )}
                { !!spriteObjects.length && (
                  <ObjectSpriteLayer
                    key={layer.name}
                    objects={spriteObjects || []}
                    controller={controller}
                    selectedActorId={selectedActorId}
                  />
                )}
              </Fragment>
            );
          }
          if (layer.type === TiledLayerType.tilelayer) {
            return (
              <RectTileLayer
                key={layer.name}
                layer={layer}
                horizontalTiles={data.width}
                tilesets={data.tilesets}
                spritesheets={spritesheets}
              />
            );
          }
          return null;
        })
      }
      <SceneEffectLayer controller={controller} />
    </Container>
  );
};

export default Tilemap;

