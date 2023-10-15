import { useMemo } from 'react'
import { type Spritesheet, type Texture } from 'pixi.js'
import { Orientation } from '.'
import { type Animation } from './useAnimation'

// returns the frames used by the current animation
const useFrames = (spritesheet: Spritesheet, animation: Animation, orientation: Orientation) => {
  const indexedFrames = useMemo(() => {
    const allFrames = Object.keys(spritesheet.textures ?? {})
    return allFrames.reduce((acc: Record<string, Texture[]>, frame: string) => {
      // frames are in the format of: 'stand-n', 'walk0-ne', 'walk1-ne' etc
      // create a mapping with arrays keyed by the part without the number,
      // eg: 'stand-n': [TEXTURE:stand-n] and 'walk-ne': [TEXTURE:walk0-ne, TEXTURE:walk1-ne]
      const key = frame.replace(/[0-9]/g, '')
      if (!acc[key]) {
        acc[key] = []
      }
      const texture = spritesheet.textures?.[frame]
      if (texture) acc[key].push(texture)
      return acc
    }, {})
  }, [spritesheet.textures])

  const prefix = useMemo(() => {
    const { image } = spritesheet.data.meta as unknown as { image: string }
    return `${image.substring(0, image.lastIndexOf('.'))}-`
  }, [spritesheet.data.meta])

  return useMemo(() => {
    if (!indexedFrames) return
    const getFrames = () => {
      // Prefix all animations with the name of the image (without the extension) and a hyphen
      // So `orc-axe-walk0-n`, `skeleton-attack1-e`
      switch (orientation) {
        case Orientation.northWest:
          return `${prefix}${animation}-${Orientation.northEast}`
        case Orientation.west:
          return `${prefix}${animation}-${Orientation.east}`
        case Orientation.southWest:
          return `${prefix}${animation}-${Orientation.southEast}`
        default:
          return `${prefix}${animation}-${orientation}`
      }
    }
    return indexedFrames[getFrames()]
  }, [animation, indexedFrames, orientation, prefix])
}

export default useFrames
