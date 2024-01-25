import { Fragment, type PropsWithChildren } from 'react'
import { type TiledMapData, TiledLayerType } from 'constants/tiledMapData'
import { Container } from '@pixi/react'
import RectTileLayer from 'components/pixi/tile/RectTileLayer'
import type * as PIXI from 'pixi.js'
import ObjectTileLayer from 'components/pixi/tile/ObjectTileLayer'
import { type SceneObject } from 'store/types/scene'
import ObjectSpriteLayer from './ObjectSpriteLayer'
import { type BaseSceneController } from 'mechanics/scenes/BaseSceneController'
import { type Props as SceneProps } from '../Scene'
import { getLayerObjects } from './utils'
import SceneEffectLayer from './SceneEffectLayer'

type Props = {
  basePath: string
  data: TiledMapData
  spritesheets: Record<string, PIXI.Spritesheet>
  objects: SceneObject[]
  controller: BaseSceneController<unknown>
  selectedActorId: string
} & SceneProps

const Tilemap = (props: PropsWithChildren<Props>) => {
  const { data, objects, controller, spritesheets, selectedActorId } = props

  return (
    <Container name="Tilemap">
      {data.layers
        .filter(l => l.visible)
        .map(layer => {
          if (layer.type === TiledLayerType.objectgroup) {
            const { tileObjects, spriteObjects } = getLayerObjects(objects, layer)
            return (
              <Fragment key={layer.name}>
                { tileObjects.length > 0 && (
                  <ObjectTileLayer
                    objects={tileObjects}
                    tilesets={data.tilesets ?? []}
                    spritesheets={spritesheets}
                  />
                )}
                { spriteObjects.length > 0 && (
                  <ObjectSpriteLayer
                    key={layer.name}
                    objects={spriteObjects ?? []}
                    controller={controller}
                    selectedActorId={selectedActorId}
                    />
                )}
              </Fragment>
            )
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
            )
          }
          return null
        })
      }
      <SceneEffectLayer controller={controller} />
    </Container>
  )
}

export default Tilemap
