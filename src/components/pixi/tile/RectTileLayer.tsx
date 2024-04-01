import { PixiComponent } from '@pixi/react'
import type * as PIXI from 'pixi.js'
import { type TiledLayerData, type TiledTilesetData } from 'constants/tiledMapData'
import { findTileset } from 'utils/tilemap'
import { CompositeTilemap } from '@pixi/tilemap'

type Props = {
  horizontalTiles: number
  layer: TiledLayerData
  tilesets: TiledTilesetData[]
  spritesheets: Record<string, PIXI.Spritesheet>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RectTileLayer = PixiComponent<Props, any>('RectTileLayer', {
  create (_props: Props) {
    const tileLayer = new CompositeTilemap()
    return tileLayer
  },

  applyProps (instance, _oldProps: Props, props: Props) {
    const { layer, tilesets, horizontalTiles, spritesheets } = props
    if (layer.data == null) {
      return
    }
    for (let i = 0; i < layer.data.length; i++) {
      const tileset = findTileset(layer.data[i], tilesets)
      if (tileset == null) continue

      const w = tileset.tilewidth
      const h = tileset.tileheight
      const x = (i % horizontalTiles) * w
      const y = Math.floor(i / horizontalTiles) * h
      const spritesheet = spritesheets[tileset.name]

      if (layer.data[i] > 0) {
        const spriteId = `${tileset.name}-${layer.data[i]}`
        if (!spritesheet.textures[spriteId]) {
          continue
        }
        instance.addFrame(spritesheet.textures[spriteId], x, y)
      }
    }
  }
})

export default RectTileLayer
