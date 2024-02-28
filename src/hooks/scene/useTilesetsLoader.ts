import { useState, useEffect } from 'react'
import { type TiledTilesetData } from 'constants/tiledMapData'
import { type SpritesheetData, type SpriteData } from 'constants/spritesheetData'
import { Assets, Spritesheet } from 'pixi.js'

// Returns a TiledTilesetData that has not been loaded into tilesetsTextures yet
const nextTilesetToload = (tilesets: TiledTilesetData[], tilesetsTextures: Record<string, Spritesheet>) => {
  return tilesets.find((t) => {
    return tilesetsTextures[t.name] === undefined
  })
}

const parseSpritesheetData = (tileset: TiledTilesetData): SpritesheetData => {
  const columns = tileset.columns

  const frames: Record<string, SpriteData> = {}
  for (let i = 0; i < tileset.tilecount; i++) {
    const w = tileset.tilewidth
    const h = tileset.tileheight
    const x = (i % columns) * w
    const y = Math.floor(i / columns) * h

    frames[`${tileset.name}-${i + tileset.firstgid}`] = {
      frame: { x, y, w, h },
      spriteSourceSize: { x, y, w, h },
      rotated: false,
      trimmed: false,
      sourceSize: { w, h }
    }
  }
  const image = tileset.image
  const size = { w: tileset.imagewidth, h: tileset.imageheight }
  return {
    frames,
    meta: {
      image,
      size,
      scale: '1'
    }
  }
}

/**
 * @param basePath
 * @returns
 */
const useTilesetsLoader = (basePath: string) => {
  const [tileSpritesheets, setTilesets] = useState<Record<string, Spritesheet>>({})
  const [data, setData] = useState<TiledTilesetData[]>()

  const loadTilesets = (value: TiledTilesetData[]) => {
    setData(value)
  }

  useEffect(() => {
    if (data == null) return
    const nextTileset = nextTilesetToload(data, tileSpritesheets)
    if (nextTileset == null) return

    const tilesetName = nextTileset.name
    const image = nextTileset.image.substring(nextTileset.image.indexOf('/'))

    const loadSpritesheet = async () => {
      const resource = await Assets.load(`${basePath}/${image}`)
      const spritesheetData = parseSpritesheetData(nextTileset)
      const spritesheet = new Spritesheet(resource, spritesheetData)
      await spritesheet.parse()

      const newTilesets = {
        ...tileSpritesheets,
        [tilesetName]: spritesheet
      }
      setTilesets(newTilesets)
    }
    loadSpritesheet()
  }, [basePath, data, tileSpritesheets])

  const loadComplete = !(data == null) && nextTilesetToload(data, tileSpritesheets) === undefined

  return {
    loadComplete,
    loadTilesets,
    tileSpritesheets
  }
}

export default useTilesetsLoader
