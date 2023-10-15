import { PixiComponent } from '@pixi/react'
import type * as PIXI from 'pixi.js'
import { type TiledTilesetData } from 'constants/tiledMapData'
import { type SceneObject } from 'store/types/scene'
import { findTileset } from 'utils/tilemap'
import { CompositeTilemap } from '@pixi/tilemap'

type Props = {
  objects: SceneObject[]
  tilesets: TiledTilesetData[]
  spritesheets: Record<string, PIXI.Spritesheet>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ObjectTileLayer = PixiComponent<Props, any>('ObjectTileLayer', {
  create (_props: Props) {
    const tileLayer = new CompositeTilemap()
    return tileLayer
  },

  applyProps (instance, _oldProps: Props, props: Props) {
    const { objects, tilesets, spritesheets } = props
    if (objects.length === 0) {
      return
    }
    instance.clear()
    if (!objects) return

    objects.forEach((object) => {
      if (!object.gid) return // todo!
      const tileset = findTileset(object.gid, tilesets)
      if (tileset == null) return

      const x = object.x
      const y = object.y - tileset.tileheight
      const spritesheet = spritesheets[tileset.name]

      // todo: add sprites!
      const spriteId = `${tileset.name}-${object.gid}`
      instance.addFrame(spritesheet.textures[spriteId], x, y)
    })
  }
})

export default ObjectTileLayer
